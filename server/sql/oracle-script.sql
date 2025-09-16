-- ⚡ Cấp quyền cần thiết cho user (nếu chưa)
ALTER USER C##SANGNT QUOTA UNLIMITED ON USERS;
GRANT CONNECT, RESOURCE, DBA TO C##SANGNT;
GRANT CREATE SESSION TO C##SANGNT;
GRANT CREATE TABLE TO C##SANGNT;
GRANT CREATE SEQUENCE TO C##SANGNT;
GRANT CREATE TRIGGER TO C##SANGNT;

-- ==========================================================
-- BẢNG EMPLOYEES
-- ==========================================================
CREATE TABLE "employees" (
    "Id"              CHAR(36)       NOT NULL,
    "FirstName"       NVARCHAR2(30)  NOT NULL,
    "LastName"        NVARCHAR2(150) NOT NULL,
    "DateOfBirth"     TIMESTAMP      NOT NULL,
    "Gender"          CHAR(1)        NOT NULL,
    "PhoneNumber"     NVARCHAR2(10)  NOT NULL,
    "Email"           NVARCHAR2(100),
    "HireDate"        TIMESTAMP      NOT NULL,
    "CertificateNumber" CHAR(10)     NOT NULL,
    CONSTRAINT "PK_employees" PRIMARY KEY ("Id")
);

-- ==========================================================
-- BẢNG DOCTORS
-- ==========================================================
CREATE TABLE "doctors" (
    "Id"             CHAR(36)       NOT NULL,
    "Specialization" NVARCHAR2(100) NOT NULL,
    "EmployeeId"     CHAR(36)       NOT NULL,
    CONSTRAINT "PK_doctors" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_doctors_employees_EmployeeId" FOREIGN KEY ("EmployeeId")
        REFERENCES "employees" ("Id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "IX_doctors_EmployeeId" ON "doctors" ("EmployeeId");

-- ==========================================================
-- BẢNG PATIENTS
-- ==========================================================
CREATE TABLE "patients" (
    "Id"              CHAR(36)       NOT NULL,
    "FirstName"       NVARCHAR2(30)  NOT NULL,
    "LastName"        NVARCHAR2(150) NOT NULL,
    "Email"           NVARCHAR2(100) NOT NULL,
    "DateOfBirth"     TIMESTAMP,
    "Nationality"     NVARCHAR2(150),
    "Gender"          CHAR(1),
    "PlaceOfResidence" NVARCHAR2(150),
    "Is_Insurance"    NUMBER(1) DEFAULT 0 NOT NULL,
    "Address"         NCLOB,
    "PhoneNumber"     NVARCHAR2(10) NOT NULL,
    "RegistrationDate" TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    CONSTRAINT "PK_patients" PRIMARY KEY ("Id")
);

-- ==========================================================
-- BẢNG USER_ACCOUNTS
-- ==========================================================
CREATE TABLE "user_accounts" (
    "Id"         CHAR(36)       NOT NULL,
    "CitizenID"  NVARCHAR2(10)  NOT NULL,
    "Password"   NVARCHAR2(30)  NOT NULL,
    "AvatarUrl"  NCLOB          NOT NULL,
    "Is_Active"  NUMBER(1) DEFAULT 1 NOT NULL,
    "PatientId"  CHAR(36),
    "EmployeeId" CHAR(36),
    CONSTRAINT "PK_user_accounts" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_user_accounts_patients_PatientId" FOREIGN KEY ("PatientId")
        REFERENCES "patients" ("Id"),
    CONSTRAINT "FK_user_accounts_employees_EmployeeId" FOREIGN KEY ("EmployeeId")
        REFERENCES "employees" ("Id")
);

-- Index để enforce quan hệ 1-1
CREATE UNIQUE INDEX "IX_user_accounts_PatientId" ON "user_accounts" ("PatientId");
CREATE UNIQUE INDEX "IX_user_accounts_EmployeeId" ON "user_accounts" ("EmployeeId");



