import prisma from "../init/prisma"
export default async () => {
    let uuid = await prisma.$queryRaw`SELECT uuid_generate_v4()` as any;
    return uuid[0]?.uuid_generate_v4;
}