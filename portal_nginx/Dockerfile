FROM nginx:1.27-alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY portal_nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]
