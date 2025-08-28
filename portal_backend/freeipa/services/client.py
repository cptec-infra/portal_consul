# portal/freeipa.py
import requests
import logging
from django.conf import settings
from requests.auth import HTTPBasicAuth
from python_freeipa import Client
from python_freeipa.exceptions import FreeIPAError

logger = logging.getLogger("freeipa")


class FreeIPA(Client):
    """
    Classe para encapsular conexão com FreeIPA usando python-freeipa para login
    e requests direto para operações JSON-RPC.
    """

    def __init__(self):
        super().__init__(
            host=settings.IPA_AUTH_SERVER,
            verify_ssl=settings.IPA_AUTH_SERVER_SSL_VERIFY,
            version=settings.IPA_AUTH_SERVER_API_VERSION
        )
        self._log = logging.getLogger(__name__)

    def connect(self):
        """Conecta e autentica no FreeIPA via python-freeipa."""
        try:
            self.login(settings.IPA_AUTH_USER, settings.IPA_AUTH_PASSWORD)
            self.log.info("Autenticado com sucesso no FreeIPA.")
        except FreeIPAError as e:
            self._log.error(f"Erro ao autenticar no FreeIPA: {e}")
            raise

    def check_connection(self):
        """Verifica se consegue autenticar e acessar FreeIPA."""
        try:
            self.connect()
            return True
        except FreeIPAError:
            return False

def get_freeipa_client():
    """Retorna um cliente FreeIPA autenticado."""
    client = FreeIPA()
    client.connect()
    return client

def get_all_groups():
    client = get_freeipa_client()
    logger = logging.getLogger("freeipa")
    try:
        logger.debug("vai iniciar a chamada group_find")
        response = client._request("group_find",[],{"sizelimit": 0,"no_members": True})

        if not isinstance(response, dict):
            logger.warning("Retorno inesperado do FreeIPA: %r", response)
            return []

        groups = response.get("result", [])

        filtered_groups = []
        for g in groups:
            filtered_groups.append({
                "cn": g.get("cn", [""])[0] if "cn" in g and g["cn"] else "",
                "description": g.get("description", [""])[0] if "description" in g and g["description"] else "",
                "gidnumber": g.get("gidnumber", [""])[0] if "gidnumber" in g and g["gidnumber"] else ""
            })

        return filtered_groups

    except FreeIPAError as e:
        logger.error("Erro ao obter grupos: %s", e)
        return []

def get_all_users():
    client = get_freeipa_client()
    logger = logging.getLogger("freeipa")
    try:
        logger.debug("vai iniciar a chamada user_find")
        response = client._request("user_find", [], {"sizelimit": 0, "no_members": True, "nsaccountlock": False, "whoami": False, "all": True})

        if not isinstance(response, dict):
            logger.warning("Retorno inesperado do FreeIPA: %r", response)
            return []

        users = response.get("result", [])

        # print(users)
        filtered_users = []
        for u in users:
            title = u.get("title", [""])[0] if "title" in u and u["title"] else ""
            if title.lower() == "sudo":
                continue

            filtered_users.append({
                "title": title,
                "uid": u.get("uid", [""])[0] if "uid" in u and u["uid"] else "",
                "uidnumber": u.get("uidnumber", [""])[0] if "uidnumber" in u and u["uidnumber"] else "",
                "mail": u.get("mail", [""])[0] if "mail" in u and u["mail"] else "",
                "firstname": u.get("givenname", [""])[0] if "givenname" in u and u["givenname"] else "",
                "lastname": u.get("sn", [""])[0] if "sn" in u and u["sn"] else "",
                "passwordexpiration": (u["krbpasswordexpiration"][0].get("__datetime__", "")if "krbpasswordexpiration" in u and u["krbpasswordexpiration"]else ""),
                "macs": u.get("pager", []) if "pager" in u and u["pager"] else [],
                "telephonenumber": u.get("telephonenumber", [""])[0] if "telephonenumber" in u and u["telephonenumber"] else "",
                "homedirectory": u.get("homedirectory", [""])[0] if "homedirectory" in u and u["homedirectory"] else "",
                "memberof_group": u.get("memberof_group", []) if "memberof_group" in u and u["memberof_group"] else [],
            })

        return filtered_users

    except FreeIPAError as e:
        logger.error("Erro ao obter usuários: %s", e)
        return []

def format_users(raw_users):
    """
    Transforma a lista de usuários do FreeIPA em formato plano.
    Converte atributos que são listas em valores únicos.
    """
    formatted = []

    for user in raw_users:
        u = {}
        for k, v in user.items():
            if isinstance(v, list) and len(v) == 1:
                u[k] = v[0]
            else:
                u[k] = v 
        formatted.append(u)

    return formatted
