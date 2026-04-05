/*
  Warnings:

  - Added the required column `shipAddress1` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipCity` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipEmail` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipState` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipZip` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shipping` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shipAddress1" TEXT NOT NULL,
ADD COLUMN     "shipAddress2" TEXT,
ADD COLUMN     "shipCity" TEXT NOT NULL,
ADD COLUMN     "shipEmail" TEXT NOT NULL,
ADD COLUMN     "shipName" TEXT NOT NULL,
ADD COLUMN     "shipState" TEXT NOT NULL,
ADD COLUMN     "shipZip" TEXT NOT NULL,
ADD COLUMN     "shipping" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "subtotal" DECIMAL(10,2) NOT NULL;
