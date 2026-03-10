//@ts-nocheck
import { PrismaClient } from '@prisma/client'
import fs from 'fs/promises'
import path from 'path'

const prisma = new PrismaClient()

async function up() {
    const users = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/users.json'),
            'utf-8'
        )
    )
    const categories = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/categories.json'),
            'utf-8'
        )
    )
    const categoryMap = Object.fromEntries(
        categories.map((c) => [c.name, c._id['$oid']])
    )

    const areas = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/areas.json'),
            'utf-8'
        )
    )
    const areaMap = Object.fromEntries(
        areas.map((a) => [a.name, a._id['$oid']])
    )

    const ingredients = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/ingredients.json'),
            'utf-8'
        )
    )
    const ingredientIds = new Set(ingredients.map((i) => i._id))

    const recipes = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/recipes.json'),
            'utf-8'
        )
    )
    const testimonials = JSON.parse(
        await fs.readFile(
            path.join(import.meta.dirname, 'data/testimonials.json'),
            'utf-8'
        )
    )

    console.log('Start seeding...')

    //create users
    for (const u of users) {
        await prisma.user.create({
            data: {
                id: u._id['$oid'],
                name: u.name,
                email: u.email,
                password: 'test'
            }
        })
    }
    //create categories
    for (const c of categories) {
        await prisma.category.create({
            data: {
                id: c._id['$oid'],
                name: c.name
            }
        })
    }
    //create areas
    for (const a of areas) {
        await prisma.area.create({
            data: {
                id: a._id['$oid'],
                name: a.name
            }
        })
    }
    // create ingredients
    for (const i of ingredients) {
        await prisma.ingredient.create({
            data: {
                id: i._id,
                name: i.name,
                description: i.desc,
                imageURL: i.img
            }
        })
    }
    // create testimonials
    for (const t of testimonials) {
        await prisma.testimonial.create({
            data: {
                id: t._id['$oid'],
                owner: t.owner['$oid'],
                text: t.testimonial
            }
        })
    }
    //create recipes
    for (const r of recipes) {
        await prisma.recipe.create({
            data: {
                id: r._id['$oid'],
                title: r.title,
                description: r.description,
                instructions: r.instructions,
                time: r.time.length > 0 ? parseInt(r.time) : 60,
                imageURL: r.thumb,

                owner: {
                    connect: { id: r.owner['$oid'] }
                },
                category: {
                    connect: { id: categoryMap[r.category] }
                },
                area: {
                    connect: { id: areaMap[r.area] }
                },

                ingredients: {
                    create: r.ingredients
                        .filter((ing) => {
                            const exists = ingredientIds.has(ing.id)
                            if (!exists)
                                console.warn(
                                    `   - Missing ingredient ${ing.id} in recipe "${r.title}"`
                                )
                            return exists
                        })
                        .map((i) => ({
                            measure: i.measure,
                            ingredient: { connect: { id: i.id } }
                        }))
                }
            }
        })
    }

    console.log('Seeding finished.')
}

async function down() {
    console.log('Cleaning database...')

    await prisma.testimonial.deleteMany()
    await prisma.recipe.deleteMany()
    await prisma.ingredient.deleteMany()
    await prisma.area.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    console.log('Database cleaned.')
}

async function main() {
    try {
        await down()
        await up()
        console.log()
    } catch (e) {
        console.log(e)
    }
}

main()
    .catch(async (e) => {
        console.log(e)
        process.exit(1)
    })
    .finally(async () => {
        prisma.$disconnect()
    })
