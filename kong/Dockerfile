FROM kong:latest
RUN yum install -y git
COPY ./kong.conf /etc/kong/kong.conf
RUN git clone https://github.com/mogui/kong-external-oauth && \
    cd kong-external-oauth && luarocks make
