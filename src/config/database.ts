import { PrismaPagination } from "./../repository-impl/pagination";
import { PrismaClient } from '@prisma/client';

 const prismaObject = new PrismaClient();
 // create pagination object for all models
 const pagination = new PrismaPagination(['staff', 'ppmvAgent'], prismaObject).init();
 
//  pagination.result();
// set prisma variable for global usage
 export const prisma = pagination.prismaObj;

 /**
  * This function provide a connection test for the db
  */
export  const DBConnection = async () => {
  try {
    const result = await prisma.$queryRaw `SELECT 1`;
    console.log('Connection successful:', result);
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

