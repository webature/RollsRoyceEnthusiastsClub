import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env", quiet: true });
loadEnv({ path: ".env.local", override: true, quiet: true });

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";
import { hashPassword } from "../lib/password";
import { slugify } from "../lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD (see .env.example) before seeding."
    );
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: await hashPassword(adminPassword) },
    create: {
      email: adminEmail,
      passwordHash: await hashPassword(adminPassword),
      role: "admin",
    },
  });
  console.log(`Admin user ready: ${admin.email}`);

  const posts = [
    {
      title: "Blue Plaque Unveiling for Nelly Thornton, the Spirit of Ecstasy Model",
      excerpt:
        "A commemorative blue plaque has been unveiled in honour of Eleanor ‘Nelly’ Thornton, the model said to have inspired Charles Sykes’ Spirit of Ecstasy mascot.",
      body: "Members and guests gathered for the unveiling of a commemorative blue plaque honouring Eleanor ‘Nelly’ Thornton, whose likeness is said to have inspired Charles Sykes’ Spirit of Ecstasy — the mascot that has graced the bonnet of every Rolls-Royce since 1911. The plaque was unveiled by Thornton's great-grandson, Tim Moorby, with representatives from the British Motor Museum and the National Motor Museum in attendance. Sykes was commissioned to create the mascot by Lord Montagu of Beaulieu, a friend of Thornton's, and her likeness is widely credited as his inspiration for its flowing, forward-leaning pose.",
      publishedAt: new Date("2026-08-04T09:00:00Z"),
      coverImage: "/images/car-silver-london.jpg",
    },
    {
      title: "RREC Annual Rally 2026 Highlight Reel Is Live",
      excerpt:
        "Relive the best moments from this year's Annual Rally in a new highlight reel — remarkable cars, memorable places and good company.",
      body: "The highlight reel from the 2026 Annual Rally is now available, capturing a weekend of concours judging, road runs and Section gatherings from across the Club. Thank you to every member who brought a car, volunteered on the day, or simply came along to enjoy it.",
      publishedAt: new Date("2026-07-23T09:00:00Z"),
      coverImage: "/images/car-bentley.jpg",
    },
    {
      title: "RREC Joins the Historic & Classic Vehicles Alliance (HCVA)",
      excerpt:
        "The Club has joined the Historic & Classic Vehicles Alliance, adding its voice to the collective effort to protect the future of historic motoring.",
      body: "The RREC has become a member of the Historic & Classic Vehicles Alliance (HCVA), joining other marque and period clubs in representing the interests of historic vehicle owners and enthusiasts to government and regulators. Membership strengthens the collective voice safeguarding the future of historic motoring in the UK.",
      publishedAt: new Date("2026-07-17T09:00:00Z"),
      coverImage: "/images/car-silver-shadow.jpg",
    },
    {
      title: "Christmas Message",
      excerpt:
        "A message from the Club to members old and new as the year draws to a close.",
      body: "As the year draws to a close, the Board and staff of the RREC wish every member — and their families — a very happy Christmas. Thank you for another year of shared enthusiasm, from Section meets to international rallies, and we look forward to seeing you on the road again in the new year.",
      publishedAt: new Date("2025-12-24T09:00:00Z"),
      coverImage: "/images/library-books.jpg",
    },
    {
      title: "RREC Takes Prime Position at Salon Privé",
      excerpt:
        "The Club had a strong presence at this year's Salon Privé, London's official concours d'elegance.",
      body: "RREC members and cars took prime position at Salon Privé, showcasing the marques to visitors from across the world at one of the UK's leading concours d'elegance events.",
      publishedAt: new Date("2024-09-04T09:00:00Z"),
      coverImage: "/images/car-silver-london.jpg",
    },
    {
      title: "Annual Rally & Concours d'Elegance 2024",
      excerpt:
        "A full report from this year's Annual Rally and Concours d'Elegance.",
      body: "This year's Annual Rally and Concours d'Elegance brought together members and their cars for a weekend of judging, driving and celebration — one of the highlights of the Club's calendar.",
      publishedAt: new Date("2024-07-30T09:00:00Z"),
      coverImage: "/images/car-silver-shadow.jpg",
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: slugify(post.title) },
      update: { coverImage: post.coverImage },
      create: {
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        body: post.body,
        coverImage: post.coverImage,
        status: "published",
        publishedAt: post.publishedAt,
        authorId: admin.id,
      },
    });
  }
  console.log(`Seeded ${posts.length} news posts.`);

  const events = [
    {
      title: "The South of England Rally",
      excerpt:
        "A regional rally at Stansted Park bringing together members and their cars for a day of driving and company.",
      body: "Join fellow members at Stansted Park for the South of England Rally — a day of driving, display and conversation for owners and enthusiasts alike. All Rolls-Royce and Bentley models welcome.",
      location: "Stansted Park, PO9 6DX",
      startsAt: new Date("2026-05-24T10:00:00Z"),
      publishedAt: new Date("2026-05-06T09:00:00Z"),
      coverImage: "/images/car-bentley.jpg",
    },
    {
      title: "Spring Rally, Køge, Denmark",
      excerpt:
        "An international gathering hosted by the Club's Danish Section, three days of touring around Køge.",
      body: "The Danish Section welcomes members from across the Club's worldwide Sections for a three-day Spring Rally based in Køge, with touring routes, shared meals and time to see fellow enthusiasts' cars up close.",
      location: "Køge, Denmark",
      startsAt: new Date("2026-05-14T09:00:00Z"),
      endsAt: new Date("2026-05-16T17:00:00Z"),
      publishedAt: new Date("2026-02-15T09:00:00Z"),
      coverImage: "/images/world-map.jpg",
    },
    {
      title: "RREC Ltd AGM",
      excerpt:
        "The Annual General Meeting of RREC Ltd, open to all members.",
      body: "All members are invited to attend the Annual General Meeting of RREC Ltd, where the Board reports on the past year and members can raise questions and vote on Club business.",
      startsAt: new Date("2026-03-29T11:00:00Z"),
      publishedAt: new Date("2026-01-21T09:00:00Z"),
      coverImage: "/images/library-books.jpg",
    },
    {
      title: "Winter Lunch & Section Gathering",
      excerpt:
        "A seasonal get-together for members to close out the year — lunch, conversation and a look ahead to next year's calendar.",
      body: "Sections across the Club close out the year with informal winter lunches — a relaxed chance to catch up with fellow members and hear what's planned for next year's events calendar. Contact your local Section for details of your nearest gathering.",
      startsAt: new Date("2026-12-06T12:00:00Z"),
      publishedAt: new Date("2026-08-10T09:00:00Z"),
      coverImage: "/images/car-silver-london.jpg",
    },
  ];

  for (const event of events) {
    await prisma.event.upsert({
      where: { slug: slugify(event.title) },
      update: { coverImage: event.coverImage },
      create: {
        title: event.title,
        slug: slugify(event.title),
        excerpt: event.excerpt,
        body: event.body,
        location: event.location,
        coverImage: event.coverImage,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        status: "published",
        publishedAt: event.publishedAt,
        authorId: admin.id,
      },
    });
  }
  console.log(`Seeded ${events.length} events.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
