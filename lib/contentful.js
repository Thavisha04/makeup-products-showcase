// Name: Lithasha Thanippuli Appuhamilage, Thavisha Thanippuli Appuhamilage
// Student ID: 100942619, 100942614
// Group no: 7
// Date created: Nov 11, 2025
// Last modified: Nov 09, 2025
// File name: contentful.js

import { createClient } from "contentful";

export const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
    environment: process.env.CONTENTFUL_ENV || "master",
});