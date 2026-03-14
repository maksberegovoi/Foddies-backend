import swaggerJsdoc from 'swagger-jsdoc'

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Foodies API',
            version: '1.0.0',
            description: 'API documentation for Foodies project'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        data: { type: 'object' }
                    }
                },
                Area: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        name: { type: 'string', example: 'Італія' }
                    }
                },

                AreasResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Area' }
                        }
                    }
                },
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        name: { type: 'string', example: 'Ivan Ivanov' },
                        email: { type: 'string', example: 'ivan@example.com' },
                        avatarURL: {
                            type: 'string',
                            example: '/images/avatar.png',
                            nullable: true
                        }
                    }
                },

                UserProfile: {
                    allOf: [
                        { $ref: '#/components/schemas/User' },
                        {
                            type: 'object',
                            properties: {
                                totalRecipes: { type: 'number', example: 5 },
                                totalFollowers: {
                                    type: 'number',
                                    example: 100
                                },
                                totalFavoriteRecipes: {
                                    type: 'number',
                                    example: 12
                                },
                                totalFollowing: { type: 'number', example: 50 }
                            }
                        }
                    ]
                },

                UserProfilePublic: {
                    allOf: [
                        { $ref: '#/components/schemas/User' },
                        {
                            type: 'object',
                            properties: {
                                totalRecipes: { type: 'number', example: 5 },
                                totalFollowers: { type: 'number', example: 100 }
                            }
                        }
                    ]
                },
                PaginatedResponseUserProfilePublic: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/UserProfilePublic'
                            }
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                totalItems: { type: 'number', example: 100 },
                                totalPages: { type: 'number', example: 10 },
                                page: { type: 'number', example: 1 },
                                pageSize: { type: 'number', example: 10 }
                            }
                        }
                    }
                },
                AvatarResponse: {
                    type: 'object',
                    properties: {
                        avatarUrl: {
                            type: 'string',
                            example: '/avatars/12345.png'
                        }
                    }
                },

                ApiResponseAvatar: {
                    type: 'object',
                    properties: {
                        data: { $ref: '#/components/schemas/AvatarResponse' }
                    }
                },
                UserDto: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        name: { type: 'string', example: 'Ivan Ivanov' },
                        email: { type: 'string', example: 'ivan@example.com' },
                        avatarURL: {
                            type: 'string',
                            example: '/avatars/default.png',
                            nullable: true
                        }
                    }
                },

                ApiResponseUserDto: {
                    type: 'object',
                    properties: {
                        data: { $ref: '#/components/schemas/UserDto' }
                    }
                },
                UserWithToken: {
                    type: 'object',
                    properties: {
                        user: { $ref: '#/components/schemas/UserDto' },
                        token: {
                            type: 'string',
                            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                        }
                    }
                },

                ApiResponseUserWithToken: {
                    type: 'object',
                    properties: {
                        data: { $ref: '#/components/schemas/UserWithToken' }
                    }
                },
                Ingredient: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        name: { type: 'string', example: 'Tomato' },
                        description: {
                            type: 'string',
                            example: 'Fresh red tomato'
                        },
                        imageURL: {
                            type: 'string',
                            example: '/images/tomato.png'
                        }
                    }
                },

                IngredientsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Ingredient' }
                        }
                    }
                },
                RecipeCard: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        title: {
                            type: 'string',
                            example: 'Spaghetti Carbonara'
                        },
                        imageURL: {
                            type: 'string',
                            example: '/images/spaghetti.png'
                        },
                        ownerId: { type: 'string', example: '123' },
                        ownerAvatarURL: {
                            type: 'string',
                            example: '/avatars/ivan.png',
                            nullable: true
                        },
                        ownerName: { type: 'string', example: 'Ivan Ivanov' }
                    }
                },

                PaginatedResponseRecipeCard: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/RecipeCard' }
                        },
                        meta: {
                            type: 'object',
                            properties: {
                                total: { type: 'number', example: 100 },
                                page: { type: 'number', example: 1 },
                                limit: { type: 'number', example: 10 }
                            }
                        }
                    }
                },
                Recipe: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        title: {
                            type: 'string',
                            example: 'Spaghetti Carbonara'
                        },
                        description: {
                            type: 'string',
                            example:
                                'Класичний італійський рецепт пасти з яйцем та беконом'
                        },
                        instructions: {
                            type: 'string',
                            example: '1. Відваріть пасту. 2. Обсмажте бекон...'
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    measure: {
                                        type: 'string',
                                        example: '100g'
                                    },
                                    name: {
                                        type: 'string',
                                        example: 'Spaghetti'
                                    },
                                    imageURL: {
                                        type: 'string',
                                        example: '/images/spaghetti.png'
                                    }
                                }
                            }
                        },
                        imageURL: {
                            type: 'string',
                            example: '/images/spaghetti.png'
                        },
                        ownerId: { type: 'string', example: '123' },
                        ownerAvatarURL: {
                            type: 'string',
                            example: '/avatars/ivan.png',
                            nullable: true
                        },
                        ownerName: { type: 'string', example: 'Ivan Ivanov' },
                        time: { type: 'number', example: 30 },
                        category: { type: 'string', example: 'Pasta' },
                        area: { type: 'string', example: 'Italy' }
                    }
                },

                ApiResponseRecipe: {
                    type: 'object',
                    properties: {
                        data: { $ref: '#/components/schemas/Recipe' }
                    }
                },
                CreateRecipeRequest: {
                    type: 'object',
                    properties: {
                        title: {
                            type: 'string',
                            example: 'Spaghetti Carbonara'
                        },
                        description: {
                            type: 'string',
                            example:
                                'Класичний італійський рецепт пасти з яйцем та беконом'
                        },
                        instructions: {
                            type: 'string',
                            example: '1. Відваріть пасту. 2. Обсмажте бекон...'
                        },
                        ingredients: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    measure: {
                                        type: 'string',
                                        example: '100g'
                                    },
                                    name: {
                                        type: 'string',
                                        example: 'Spaghetti'
                                    },
                                    imageURL: {
                                        type: 'string',
                                        example: '/images/spaghetti.png'
                                    }
                                }
                            }
                        },
                        imageURL: {
                            type: 'string',
                            example: '/images/spaghetti.png'
                        },
                        time: { type: 'number', example: 30 },
                        category: { type: 'string', example: 'Pasta' },
                        area: { type: 'string', example: 'Italy' }
                    },
                    required: [
                        'title',
                        'description',
                        'instructions',
                        'ingredients',
                        'imageURL',
                        'time',
                        'category',
                        'area'
                    ]
                },

                CreateRecipeResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', example: '1' }
                            }
                        }
                    }
                },
                Testimonial: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', example: '1' },
                        owner: { type: 'string', example: 'Ivan Ivanov' },
                        text: {
                            type: 'string',
                            example: 'Цей рецепт дуже смачний!'
                        }
                    }
                },

                TestimonialsResponse: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/Testimonial' }
                        }
                    }
                }
            }
        }
    },

    apis: ['./src/modules/**/*.ts']
}

export const swaggerSpec = swaggerJsdoc(swaggerOptions)
