# Express server with SSL enabled

Please create the self-signed certificate and private key to path `/certs` by following command:

```bash
./create_certs.sh
```

When running this example, the application runs on

* https://localhost:8443

and asks the user to make a security exception in the browser in order to see the pages.
CAUTION: *Self-signed certificates should never be used in production environments!*
