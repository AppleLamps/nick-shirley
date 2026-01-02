---
name: neon-db-security-check
description: Review Neon (Postgres) project security posture using project details like roles/users, connection strings, branches, IP allowlists, integrations, and schema info. Use when asked to identify misconfigurations, rate severity, and produce a prioritized hardening checklist with exact SQL and Neon settings remediation steps.
---

# Neon Db Security Check

## Overview

Perform a security review of Neon Postgres configuration and schema details, identify risks, rate severity, and produce a prioritized hardening checklist with exact SQL and Neon console settings.

## Workflow

1. Gather inputs
   - Confirm provided artifacts: roles/users, grants, connection strings, branches, IP allowlists, integrations, schema info, and any app access patterns.
   - If any are missing, ask targeted questions before assessing.
2. Inventory and baseline
   - Summarize current access model (roles, ownership, schemas, extensions).
   - Summarize network and auth posture (allowlists, TLS/SSL, secrets handling).
   - Summarize operational controls (auditing/logging, backups/retention, branch protections).
3. Run security checks by category
   - Use the checklist below and record evidence for each finding.
4. Rate severity
   - Use the severity rubric and justify the rating.
5. Produce hardening checklist
   - Provide prioritized, actionable fixes with exact SQL or Neon settings steps.
   - Include safe remediation guidance and verification commands.

## Security Checks (by category)

### Roles and Privileges

- Flag superuser-like roles or broad grants outside admin use.
- Flag application roles owning schemas or tables they should not.
- Ensure least-privilege access:
  - Prefer a role per service with minimal privileges.
  - Use read-only roles for reporting.
- Ensure default privileges are locked down for new tables/sequences/functions.
- Check PUBLIC grants:
  - Revoke CREATE on schema public and ALL on database if not required.
- Verify ownership and grant chains:
  - Avoid GRANT with GRANT OPTION for app roles.

### Network Exposure and Access Controls

- Check IP allowlists for broad ranges (0.0.0.0/0, ::/0).
- Confirm only required branches/endpoints are exposed.
- Identify shared connections across environments.
- Ensure direct access to production is tightly restricted.

### Auth and Secret Handling

- Ensure connection strings are not embedded in code or logs.
- Flag weak or shared credentials; require per-service users.
- Require TLS by client settings (use sslmode=require or stronger).
- Prefer short-lived credentials or secret managers if available.

### Branches and Environments

- Separate prod/staging/dev branches with distinct roles and credentials.
- Lock down or protect prod branches in Neon console.
- Flag direct writes to prod from CI or developer machines without controls.

### Schema, RLS, and Permission Gaps

- Identify tables without RLS where tenant isolation is required.
- Validate RLS policies for SELECT/INSERT/UPDATE/DELETE.
- Check for SECURITY DEFINER functions that could elevate privileges.
- Ensure sensitive data is not exposed via views or functions.

### SQL Injection and Unsafe Query Patterns

- If app query patterns or ORM usage are provided, flag string concatenation and
  missing parameterization; call out high-risk endpoints.
- If app code is not provided, note as a risk gap and recommend review.

### Audit/Logging and Monitoring

- Verify availability of query logs or audit trails.
- Flag lack of monitoring for privileged access or schema changes.
- Recommend alerting on auth failures and unusual access patterns.

### Backups, Retention, and Recovery

- Verify backup schedules and retention periods for prod.
- Flag missing PITR or insufficient retention for compliance needs.
- Ensure restore process is documented and tested.

## Severity Rubric

- Critical: Public exposure of production data, superuser access for app roles,
  no TLS on prod connections, or evidence of active exploitation.
- High: Broad grants or weak auth that could lead to data loss/compromise.
- Medium: Misconfigurations with limited blast radius or requiring insider access.
- Low: Best-practice gaps or hygiene issues with minimal immediate risk.

## Output Requirements

Provide a prioritized checklist with exact remediation steps. Use this template:

```
Finding: <short title>
Severity: <Critical | High | Medium | Low>
Evidence: <concise evidence from provided config>
Risk: <impact in 1-2 sentences>
Remediation:
  - Neon setting: <step-by-step in console or API>
  - SQL: <exact SQL statements, if applicable>
  - Safe rollout: <staging-first, change window, verification>
Verify:
  - <SQL or operational check to confirm fix>
```

## Recommended SQL Snippets

Use or adapt as needed based on findings:

```
REVOKE ALL ON DATABASE <db> FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

CREATE ROLE app_readonly NOINHERIT;
GRANT CONNECT ON DATABASE <db> TO app_readonly;
GRANT USAGE ON SCHEMA <schema> TO app_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA <schema> TO app_readonly;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema>
  GRANT SELECT ON TABLES TO app_readonly;

CREATE ROLE app_rw NOINHERIT;
GRANT CONNECT ON DATABASE <db> TO app_rw;
GRANT USAGE ON SCHEMA <schema> TO app_rw;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA <schema> TO app_rw;
ALTER DEFAULT PRIVILEGES IN SCHEMA <schema>
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_rw;

REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA <schema> FROM PUBLIC;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA <schema> TO app_rw;

ALTER ROLE <app_user> IN ROLE app_rw;
```

If RLS is needed, include:

```
ALTER TABLE <schema>.<table> ENABLE ROW LEVEL SECURITY;
CREATE POLICY <policy_name> ON <schema>.<table>
  USING (<predicate>) WITH CHECK (<predicate>);
```

## Clarifying Questions

Ask concise follow-ups when needed:
- Which branches are production and who should access them?
- Are there tenant isolation or compliance requirements?
- What is the expected access model for services and humans?
- Are there existing incident, audit, or backup requirements?
