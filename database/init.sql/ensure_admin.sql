-- Ensure admin user exists
-- This uses standard SQL that will work in PostgreSQL

-- Insert admin user if it doesn't exist
INSERT INTO "Users" ("UserName", "Email", "PasswordHash", "PasswordSalt", "Role", "CreatedAt")
VALUES (
    'admin', 
    'admin@library.com',
    'iEcviY8dQGdeKYMPvlUhAFXpzbFtK79p6I5F3UKK1Bv68rNnTLYMwAGpDhPz2UFIXsw9hXs+SBQUGVQxMPGb6Q',
    'x9w5W/U2SivpEt34/6Y2oOGbeyk9q3Dv1h3o0UEsL4Fj37o9/Aw/qJ6jDLUaHqYfvQrqO50TJ18xvQf8NvHwlptVB0KnvqLMCEIMc3Y4+wr4QnHLZ3uy/IMQR32CPWYcYc6Cw2VuYFWk7A0aIzQg+FiLbFAH3oEQWdqUWRRZmv4=',
    1, -- Admin role
    CURRENT_TIMESTAMP
)
ON CONFLICT ("Email") 
DO UPDATE SET
    "PasswordHash" = 'iEcviY8dQGdeKYMPvlUhAFXpzbFtK79p6I5F3UKK1Bv68rNnTLYMwAGpDhPz2UFIXsw9hXs+SBQUGVQxMPGb6Q',
    "PasswordSalt" = 'x9w5W/U2SivpEt34/6Y2oOGbeyk9q3Dv1h3o0UEsL4Fj37o9/Aw/qJ6jDLUaHqYfvQrqO50TJ18xvQf8NvHwlptVB0KnvqLMCEIMc3Y4+wr4QnHLZ3uy/IMQR32CPWYcYc6Cw2VuYFWk7A0aIzQg+FiLbFAH3oEQWdqUWRRZmv4=',
    "Role" = 1; -- Ensure admin role