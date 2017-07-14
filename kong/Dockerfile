FROM kong:latest
RUN yum -y install git
RUN git clone https://github.com/XVincentX/kong-external-oauth
RUN cd kong-external-oauth && luarocks make
