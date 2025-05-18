-- Database initialization script for the Library Management System
-- This script will create tables if they don't exist
CREATE TABLE IF NOT EXISTS "Books" (
    "Id" SERIAL PRIMARY KEY,
    "Title" VARCHAR(255) NOT NULL,
    "Author" VARCHAR(255) NOT NULL,
    "PublishedYear" INTEGER,
    "Genre" INTEGER NOT NULL,
    "Publisher" VARCHAR(100) NOT NULL,
    "CatalogNumber" VARCHAR(20) NOT NULL,
    "TotalCopies" INTEGER NOT NULL DEFAULT 1,
    "AvailableCopies" INTEGER NOT NULL DEFAULT 1,
    "CoverImagePath" VARCHAR(255) NULL
);

CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "UserName" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(255) NOT NULL,
    "PasswordHash" VARCHAR(255) NOT NULL,
    "PasswordSalt" VARCHAR(255) NOT NULL,
    "ResetToken" VARCHAR(255) NULL,
    "ResetTokenExpiry" TIMESTAMP NULL,
    "Role" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "CheckOuts" (
    "Id" SERIAL PRIMARY KEY,
    "BookId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "CheckOutDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DueDate" TIMESTAMP NOT NULL,
    "ReturnDate" TIMESTAMP NULL,
    "Status" INTEGER NOT NULL DEFAULT 0,
    "Notes" VARCHAR(255) NULL,
    CONSTRAINT fk_book FOREIGN KEY ("BookId") REFERENCES "Books" ("Id") ON DELETE CASCADE,
    CONSTRAINT fk_user FOREIGN KEY ("UserId") REFERENCES "Users" ("Id") ON DELETE CASCADE
);

-- Sample data for Books with cover image paths
INSERT INTO "Books" ("Title", "Author", "PublishedYear", "Genre", "Publisher", "CatalogNumber", "TotalCopies", "AvailableCopies", "CoverImagePath")
VALUES
('Moby-Dick', 'Herman Melville', 1851, 0, 'Harper & Brothers', 'FIC-MEL-001', 3, 3, '/uploads/covers/1_Moby-Dick.jpg'),
('The Odyssey', 'Homer', -800, 3, 'Penguin Classics', 'FIC-HOM-001', 4, 4, '/uploads/covers/2_The Odyssey.jpg'),
('War and Peace', 'Leo Tolstoy', 1869, 0, 'The Russian Messenger', 'FIC-TOL-001', 2, 2, '/uploads/covers/3_War and Peace.jpg'),
('Crime and Punishment', 'Fyodor Dostoevsky', 1866, 0, 'The Russian Messenger', 'FIC-DOS-001', 4, 4, '/uploads/covers/4_Crime and Punishment.jpg'),
('Jane Eyre', 'Charlotte Brontë', 1847, 2, 'Smith, Elder & Co.', 'FIC-BRO-002', 3, 3, '/uploads/covers/5_Jane Eyre.jpg'),
('Wuthering Heights', 'Emily Brontë', 1847, 2, 'Thomas Cautley Newby', 'FIC-BRO-003', 3, 3, '/uploads/covers/6_Wuthering Heights.jpg'),
('Great Expectations', 'Charles Dickens', 1861, 0, 'Chapman & Hall', 'FIC-DIC-001', 4, 4, '/uploads/covers/7_Great Expectations.jpg'),
('The Brothers Karamazov', 'Fyodor Dostoevsky', 1880, 0, 'The Russian Messenger', 'FIC-DOS-002', 2, 2, '/uploads/covers/8_The Brothers Karamazov.jpg'),
('Animal Farm', 'George Orwell', 1945, 1, 'Secker & Warburg', 'FIC-ORW-002', 5, 5, '/uploads/covers/9_Animal Farm.jpg'),
('The Grapes of Wrath', 'John Steinbeck', 1939, 0, 'The Viking Press', 'FIC-STE-001', 3, 3, '/uploads/covers/10_The Grapes of Wrath.jpg'),
('Little Women', 'Louisa May Alcott', 1868, 2, 'Roberts Brothers', 'FIC-ALC-001', 4, 4, '/uploads/covers/11_Little Women.jpg'),
('Catch-22', 'Joseph Heller', 1961, 1, 'Simon & Schuster', 'FIC-HEL-001', 3, 3, '/uploads/covers/12_Catch-22.jpg'),
('The Alchemist', 'Paulo Coelho', 1988, 4, 'HarperTorch', 'FIC-COE-001', 4, 4, '/uploads/covers/13_The Alchemist.jpg'),
('Don Quixote', 'Miguel de Cervantes', 1605, 3, 'Francisco de Robles', 'FIC-CER-001', 2, 2, '/uploads/covers/14_Don Quixote.jpg'),
('Fahrenheit 451', 'Ray Bradbury', 1953, 1, 'Ballantine Books', 'FIC-BRA-001', 5, 5, '/uploads/covers/15_Fahrenheit 451.jpg'),
('Slaughterhouse-Five', 'Kurt Vonnegut', 1969, 1, 'Delacorte', 'FIC-VON-001', 3, 3, '/uploads/covers/16_Slaughterhouse-Five.jpg'),
('Dracula', 'Bram Stoker', 1897, 2, 'Archibald Constable and Company', 'FIC-STO-001', 4, 4, '/uploads/covers/17_Dracula.jpg'),
('Frankenstein', 'Mary Shelley', 1818, 2, 'Lackington, Hughes, Harding, Mavor & Jones', 'FIC-SHE-001', 4, 4, '/uploads/covers/18_Frankenstein.jpg'),
('Les Misérables', 'Victor Hugo', 1862, 0, 'A. Lacroix, Verboeckhoven & Cie.', 'FIC-HUG-001', 2, 2, '/uploads/covers/19_Les Misérables.jpg'),
('The Picture of Dorian Gray', 'Oscar Wilde', 1890, 0, 'Lippincott''s Monthly Magazine', 'FIC-WIL-001', 4, 4, '/uploads/covers/20_The Picture of Dorian Gray.jpg'),
('A Tale of Two Cities', 'Charles Dickens', 1859, 0, 'Chapman & Hall', 'FIC-DIC-002', 3, 3, '/uploads/covers/21_A Tale of Two Cities.jpg'),
('The Scarlet Letter', 'Nathaniel Hawthorne', 1850, 0, 'Ticknor, Reed & Fields', 'FIC-HAW-001', 2, 2, '/uploads/covers/22_The Scarlet Letter.jpg'),
('The Adventures of Huckleberry Finn', 'Mark Twain', 1884, 3, 'Chatto & Windus', 'FIC-TWA-001', 5, 5, '/uploads/covers/23_The Adventures of Huckleberry Finn.jpg'),
('The Old Man and the Sea', 'Ernest Hemingway', 1952, 0, 'Charles Scribner''s Sons', 'FIC-HEM-001', 3, 3, '/uploads/covers/24_The Old Man and the Sea.jpg'),
('One Hundred Years of Solitude', 'Gabriel García Márquez', 1967, 4, 'Harper & Row', 'FIC-MAR-001', 4, 4, '/uploads/covers/25_One Hundred Years of Solitude.jpg'),
('The Chronicles of Narnia', 'C.S. Lewis', 1956, 3, 'Geoffrey Bles', 'FIC-LEW-001', 5, 5, '/uploads/covers/26_The Chronicles of Narnia.jpg'),
('Dune', 'Frank Herbert', 1965, 3, 'Chilton Books', 'FIC-HER-001', 3, 3, '/uploads/covers/27_Dune.jpg'),
('The Shining', 'Stephen King', 1977, 4, 'Doubleday', 'FIC-KIN-001', 4, 4, '/uploads/covers/28_The Shining.jpg'),
('The Sun Also Rises', 'Ernest Hemingway', 1926, 0, 'Scribner', 'FIC-HEM-002', 3, 3, '/uploads/covers/29_The Sun Also Rises.jpg'),
('Rebecca', 'Daphne du Maurier', 1938, 2, 'Victor Gollancz Ltd', 'FIC-MAU-001', 4, 4, '/uploads/covers/30_Rebecca.jpg'),
('A Passage to India', 'E.M. Forster', 1924, 0, 'Edward Arnold', 'FIC-FOR-001', 2, 2, '/uploads/covers/31_A Passage to India.jpg'),
('The Kite Runner', 'Khaled Hosseini', 2003, 4, 'Riverhead Books', 'FIC-HOS-001', 5, 5, '/uploads/covers/32_The Kite Runner.jpg'),
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 2005, 4, 'Norstedts Förlag', 'FIC-LAR-001', 4, 4, '/uploads/covers/33_The Girl with the Dragon Tattoo.jpg'),
('Memoirs of a Geisha', 'Arthur Golden', 1997, 2, 'Alfred A. Knopf', 'FIC-GOL-001', 3, 3, '/uploads/covers/34_Memoirs of a Geisha.jpg'),
('The Handmaid''s Tale', 'Margaret Atwood', 1985, 1, 'McClelland and Stewart', 'FIC-ATW-001', 4, 4, '/uploads/covers/35_The Handmaid''s Tale.jpg'),
('Gone with the Wind', 'Margaret Mitchell', 1936, 2, 'Macmillan Publishers', 'FIC-MIT-001', 4, 4, '/uploads/covers/36_Gone with the Wind.jpg'),
('Life of Pi', 'Yann Martel', 2001, 4, 'Knopf Canada', 'FIC-MAR-002', 4, 4, '/uploads/covers/37_Life of Pi.jpg'),
('The Hunger Games', 'Suzanne Collins', 2008, 4, 'Scholastic Press', 'FIC-COL-001', 6, 6, '/uploads/covers/38_The Hunger Games.jpg'),
('Ender''s Game', 'Orson Scott Card', 1985, 3, 'Tor Books', 'FIC-CAR-001', 3, 3, '/uploads/covers/39_Ender''s Game.jpg'),
('The Road', 'Cormac McCarthy', 2006, 1, 'Alfred A. Knopf', 'FIC-MCC-001', 3, 3, '/uploads/covers/40_The Road.jpg'),
('The Fault in Our Stars', 'John Green', 2012, 2, 'Dutton Books', 'FIC-GRE-001', 4, 4, '/uploads/covers/41_The Fault in Our Stars.jpg'),
('Beloved', 'Toni Morrison', 1987, 0, 'Alfred A. Knopf', 'FIC-MOR-001', 3, 3, '/uploads/covers/42_Beloved.jpg'),
('The Book Thief', 'Markus Zusak', 2005, 4, 'Picador', 'FIC-ZUS-001', 4, 4, '/uploads/covers/43_The Book Thief.jpg'),
('The Secret Garden', 'Frances Hodgson Burnett', 1911, 2, 'Frederick A. Stokes', 'FIC-BUR-001', 3, 3, '/uploads/covers/44_The Secret Garden.jpg'),
('A Clockwork Orange', 'Anthony Burgess', 1962, 1, 'Heinemann', 'FIC-BUR-002', 4, 4, '/uploads/covers/45_A Clockwork Orange.jpg'),
('Lolita', 'Vladimir Nabokov', 1955, 0, 'Olympia Press', 'FIC-NAB-001', 3, 3, '/uploads/covers/46_Lolita.jpg'),
('Persuasion', 'Jane Austen', 1817, 2, 'John Murray', 'FIC-AUS-002', 2, 2, '/uploads/covers/47_Persuasion.jpg'),
('Murder on the Orient Express', 'Agatha Christie', 1934, 4, 'Collins Crime Club', 'FIC-CHR-001', 4, 4, '/uploads/covers/48_Murder on the Orient Express.jpg'),
('The Count of Monte Cristo', 'Alexandre Dumas', 1844, 0, 'Penguin Classics', 'FIC-DUM-001', 4, 4, '/uploads/covers/49_The Count of Monte Cristo.jpg'),
('Treasure Island', 'Robert Louis Stevenson', 1883, 3, 'Cassell & Co.', 'FIC-STE-002', 3, 3, '/uploads/covers/50_Treasure Island.jpg'),
('The Hitchhiker''s Guide to the Galaxy', 'Douglas Adams', 1979, 3, 'Pan Books', 'FIC-ADA-001', 5, 5, '/uploads/covers/51_The Hitchhiker''s Guide to the Galaxy.jpg'),
('Charlotte''s Web', 'E.B. White', 1952, 2, 'Harper & Brothers', 'FIC-WHI-001', 3, 3, '/uploads/covers/52_Charlotte''s Web.jpg');

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

-- Create a sample regular user for testing
INSERT INTO "Users" ("UserName", "Email", "PasswordHash", "PasswordSalt", "Role", "CreatedAt")
VALUES (
    'user', 
    'user@library.com',
    'iEcviY8dQGdeKYMPvlUhAFXpzbFtK79p6I5F3UKK1Bv68rNnTLYMwAGpDhPz2UFIXsw9hXs+SBQUGVQxMPGb6Q',
    'x9w5W/U2SivpEt34/6Y2oOGbeyk9q3Dv1h3o0UEsL4Fj37o9/Aw/qJ6jDLUaHqYfvQrqO50TJ18xvQf8NvHwlptVB0KnvqLMCEIMc3Y4+wr4QnHLZ3uy/IMQR32CPWYcYc6Cw2VuYFWk7A0aIzQg+FiLbFAH3oEQWdqUWRRZmv4=',
    0, -- Regular user role
    CURRENT_TIMESTAMP
)
ON CONFLICT ("Email") DO NOTHING;
