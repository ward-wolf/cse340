-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- ========================================
-- Project Table
-- Adding on delete cascade will delete all projects belonging to an organization if the organization is deleted, not required but I am choosing to add it just in case it helps in a future week
-- ========================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL REFERENCES organization(organization_id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL
);

-- ========================================
-- Insert sample data: Projects
-- ========================================

-- BrightFuture Builders (organization_id = 1)
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
(1, 'Wheelchair Ramp Build', 'Construct accessible ramps for four homes of residents with limited mobility.', 'Midland, TX', '2026-10-10'),
(1, 'Playground Restoration', 'Replace worn equipment and resurface the play area at a neighborhood park.', 'Odessa, TX', '2026-10-24'),
(1, 'Senior Home Repair Day', 'Weatherproof windows and repair porches for elderly homeowners before winter.', 'Big Spring, TX', '2026-11-14'),
(1, 'Community Center Painting', 'Repaint the interior of the local community center and refresh its meeting rooms.', 'Andrews, TX', '2027-01-16'),
(1, 'Bus Shelter Installation', 'Build three covered shelters at high-traffic public transit stops.', 'Midland, TX', '2027-03-06');

-- GreenHarvest Growers (organization_id = 2)
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
(2, 'Fall Community Garden Prep', 'Clear summer beds, add compost, and plant cover crops for the winter season.', 'Midland, TX', '2026-10-03'),
(2, 'Seed Library Launch', 'Sort and catalog donated seeds to open a free seed library at the public library.', 'Odessa, TX', '2026-10-17'),
(2, 'Composting Workshop', 'Teach families to build backyard compost bins from reclaimed materials.', 'Big Spring, TX', '2026-11-07'),
(2, 'Winter Greenhouse Build', 'Assemble two hoop houses to extend the growing season for the food bank garden.', 'Midland, TX', '2026-12-05'),
(2, 'Neighborhood Orchard Planting', 'Plant twenty fruit trees along a public walking path for community harvest.', 'Andrews, TX', '2027-04-10');

-- UnityServe Volunteers (organization_id = 3)
INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
(3, 'Autumn Food Drive', 'Collect and sort nonperishable donations for regional food pantries.', 'Midland, TX', '2026-10-09'),
(3, 'After-School Tutoring', 'Provide weekly math and reading tutoring for elementary school students.', 'Odessa, TX', '2026-10-30'),
(3, 'Senior Technology Help', 'Assist older adults with smartphones, email, and video calls at the senior center.', 'Big Spring, TX', '2026-11-20'),
(3, 'Winter Coat Collection', 'Gather, clean, and distribute warm coats to families in need before the coldest months.', 'Midland, TX', '2026-12-12'),
(3, 'Spring Park Cleanup', 'Remove litter, clear trails, and mulch garden beds at three city parks.', 'Andrews, TX', '2027-05-08');
