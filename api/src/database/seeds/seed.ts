import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Match } from '../entities/match.entity';

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: process.env.DATABASE_PATH || './db.sqlite',
  entities: [User, Match],
  synchronize: true,
});

const seedUsers = [
  { name: 'Alice Rossi', email: 'alice@example.com', password: 'password123' },
  { name: 'Bob Ferrari', email: 'bob@example.com', password: 'password123' },
  { name: 'Carla Bianchi', email: 'carla@example.com', password: 'password123' },
  { name: 'Davide Greco', email: 'davide@example.com', password: 'password123' },
  { name: 'Elena Russo', email: 'elena@example.com', password: 'password123' },
  { name: 'Francesco Marino', email: 'francesco@example.com', password: 'password123' },
  { name: 'Giulia Conti', email: 'giulia@example.com', password: 'password123' },
  { name: 'Luca Esposito', email: 'luca@example.com', password: 'password123' },
];

async function seed() {
  await dataSource.initialize();
  const userRepo = dataSource.getRepository(User);
  const matchRepo = dataSource.getRepository(Match);

  // Clear existing data
  await matchRepo.clear();
  await userRepo.clear();

  // Create users
  const createdUsers: User[] = [];
  for (const u of seedUsers) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    const user = userRepo.create({
      name: u.name,
      email: u.email,
      passwordHash,
      isAvailable: 1,
    });
    createdUsers.push(await userRepo.save(user));
  }

  // Create a few sample weekly matches
  const sampleMatches = [
    { userOneId: createdUsers[0].id, userTwoId: createdUsers[1].id, type: 'weekly' as const, status: 'pending' as const },
    { userOneId: createdUsers[2].id, userTwoId: createdUsers[3].id, type: 'weekly' as const, status: 'completed' as const },
    { userOneId: createdUsers[4].id, userTwoId: createdUsers[5].id, type: 'on_demand' as const, status: 'pending' as const },
  ];

  for (const m of sampleMatches) {
    const match = matchRepo.create({
      ...m,
      completedAt: m.status === 'completed' ? new Date().toISOString() : null,
    });
    await matchRepo.save(match);
  }

  console.log(`✅ Seeded ${createdUsers.length} users and ${sampleMatches.length} matches`);
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
