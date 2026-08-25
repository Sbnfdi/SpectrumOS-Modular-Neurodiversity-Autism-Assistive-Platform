import { seedInitialData } from './seed';
import { db } from './index';
import { profiles, routines, socialStories, speechAttempts } from './schema';

console.log('Seeding database...');
seedInitialData();

console.log('Profiles in DB:', db.select().from(profiles).all());
console.log('Routines in DB:', db.select().from(routines).all());
console.log('Social Stories in DB:', db.select().from(socialStories).all());
console.log('Speech Attempts in DB:', db.select().from(speechAttempts).all());
console.log('Database verified successfully!');
