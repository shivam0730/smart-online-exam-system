const { PrismaClient, Role } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
    const adminEmail = "admin@soe.com";

    const existingAdmin = await prisma.user.findUnique({
        where: {
            email: adminEmail,
        },
    });

    if (existingAdmin) {
        console.log("✅ Super Admin already exists.");
        return;
    }

    const hashedPassword = await bcrypt.hash("Admin@123", 10);

    await prisma.user.create({
        data: {
            firstName: "Super",
            lastName: "Admin",
            email: adminEmail,
            password: hashedPassword,
            role: Role.SUPER_ADMIN,
        },
    });

    console.log("✅ Super Admin created successfully.");
}

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });