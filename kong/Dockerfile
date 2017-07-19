FROM kong:latest
COPY ./kong.conf /etc/kong/kong.conf
RUN luarocks install external-oauth
