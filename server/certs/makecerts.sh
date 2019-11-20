#!/bin/sh

echo "Step 1: Making cert & key files [NOTE: passphrase needs to be >4 characters]"
openssl req -x509 -newkey rsa:4096 -sha256 -keyout localhost.key -out localhost.crt -days 3650 -config san.cfg

echo "Step 2: Linking cert & key files [NOTE: export password can be blank]"
openssl pkcs12 -export -name “localhost” -out localhost.pfx -inkey localhost.key -in localhost.crt

echo "Step 3: Profit :)"