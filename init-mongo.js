db = db.getSiblingDB('portal_mongo'); 

db.createUser({
  user: "app_user",
  pwd: "app_password",
  roles: [
    {
      role: "readWrite",
      db: "portal_mongo"
    }
  ]
});
