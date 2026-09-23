# FarmLink live deployment

This project is packaged as a real PHP/Apache web service with MySQL and a health endpoint.

## Local

1. Install Docker Desktop.
2. From this folder run:
   `docker compose up --build`
3. Open `http://localhost:8080`.
4. The database is initialized from `database/schema.sql` and seed data from `database/seed_marketplace.sql`.

## Production

A `render.yaml` Blueprint is included for a web service plus MySQL. Render can deploy Docker services and gives the web service a public `onrender.com` URL. Connect your Git repository, review the generated database password/environment variables, and deploy.

The live URL cannot be created from this ZIP alone: deployment requires access to a hosting account and repository credentials. Do not put database passwords, SMTP credentials, payment secret keys, or other secrets into the source code.

## Before public launch

- Configure real SMTP/email delivery so verification emails reliably reach users.
- Connect a real tokenized payment provider; never store raw card numbers/CVV in FarmLink.
- Add CSRF protection to state-changing browser requests.
- Add rate limits and login/verification attempt limits.
- Enable HTTPS and confirm secure cookies.
- Configure backups and monitoring for MySQL.
- Add an admin dashboard for seller/driver verification.
- Add real-time WebSocket infrastructure for chat and driver location updates.
- Add storage/CDN for uploaded product, livestock and verification images.
