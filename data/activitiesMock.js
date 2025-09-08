const activitiesMock = {
    meta: {
        count: "10",
        links: {
            self: "https://test.api.amadeus.com/v1/shopping/activities?longitude=-3.69170868&latitude=40.41436995&radius=1",
        },
    },
    data: [
        {
            id: "23642",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23642",
                methods: ["GET"],
            },
            name: "Skip-the-line tickets to the Prado Museum",
            shortDescription:
                "Book your tickets for the Prado Museum in Madrid, discover masterpieces by Velázquez, Goya, Mantegna, Raphael, Tintoretto and access all temporary exhibitions.",
            geoCode: {
                latitude: "40.414000",
                longitude: "-3.691000",
            },
            rating: "4.5",
            pictures: ["https://images.musement.com/cover/0001/07/prado-museum-tickets_header-6456.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=2WxbgL36",
            price: {
                currencyCode: "EUR",
                amount: "16.00",
            },
        },
        {
            id: "23643",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23643",
                methods: ["GET"],
            },
            name: "Madrid Royal Palace Guided Tour",
            shortDescription:
                "Enjoy a guided tour of the Royal Palace of Madrid, one of the most beautiful palaces in Europe.",
            geoCode: {
                latitude: "40.417000",
                longitude: "-3.714000",
            },
            rating: "4.7",
            pictures: ["https://images.musement.com/cover/0002/10/royal-palace-madrid.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Palace123",
            price: {
                currencyCode: "EUR",
                amount: "25.00",
            },
        },
        {
            id: "23644",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23644",
                methods: ["GET"],
            },
            name: "Flamenco Show with Dinner",
            shortDescription:
                "Experience authentic Spanish culture with a flamenco performance and a traditional dinner.",
            geoCode: {
                latitude: "40.420000",
                longitude: "-3.706000",
            },
            rating: "4.8",
            pictures: ["https://images.musement.com/cover/0003/15/flamenco-show.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Flamenco456",
            price: {
                currencyCode: "EUR",
                amount: "45.00",
            },
        },
        {
            id: "23645",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23645",
                methods: ["GET"],
            },
            name: "Retiro Park Bike Tour",
            shortDescription: "Ride through Madrid’s famous Retiro Park with a local guide.",
            geoCode: {
                latitude: "40.415000",
                longitude: "-3.684000",
            },
            rating: "4.3",
            pictures: ["https://images.musement.com/cover/0004/21/retiro-park-bike.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Retiro789",
            price: {
                currencyCode: "EUR",
                amount: "20.00",
            },
        },
        {
            id: "23646",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23646",
                methods: ["GET"],
            },
            name: "Santiago Bernabéu Stadium Tour",
            shortDescription: "Visit the home of Real Madrid CF, including the museum, trophy room and pitch side.",
            geoCode: {
                latitude: "40.453000",
                longitude: "-3.688000",
            },
            rating: "4.6",
            pictures: ["https://images.musement.com/cover/0005/12/bernabeu-tour.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Bernabeu101",
            price: {
                currencyCode: "EUR",
                amount: "30.00",
            },
        },
        {
            id: "23647",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23647",
                methods: ["GET"],
            },
            name: "Tapas and Wine Walking Tour",
            shortDescription: "Discover Madrid’s best tapas bars and taste local wines with an expert guide.",
            geoCode: {
                latitude: "40.416000",
                longitude: "-3.703000",
            },
            rating: "4.9",
            pictures: ["https://images.musement.com/cover/0006/18/tapas-tour.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Tapas202",
            price: {
                currencyCode: "EUR",
                amount: "50.00",
            },
        },
        {
            id: "23648",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23648",
                methods: ["GET"],
            },
            name: "Toledo Day Trip from Madrid",
            shortDescription:
                "Enjoy a full-day guided tour to the historic city of Toledo, a UNESCO World Heritage Site.",
            geoCode: {
                latitude: "39.862000",
                longitude: "-4.027000",
            },
            rating: "4.7",
            pictures: ["https://images.musement.com/cover/0007/24/toledo-day-trip.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Toledo303",
            price: {
                currencyCode: "EUR",
                amount: "65.00",
            },
        },
        {
            id: "23649",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23649",
                methods: ["GET"],
            },
            name: "Segovia Half-Day Tour",
            shortDescription: "Visit the beautiful town of Segovia and see its famous Roman aqueduct.",
            geoCode: {
                latitude: "40.950000",
                longitude: "-4.125000",
            },
            rating: "4.4",
            pictures: ["https://images.musement.com/cover/0008/19/segovia-tour.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Segovia404",
            price: {
                currencyCode: "EUR",
                amount: "55.00",
            },
        },
        {
            id: "23650",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23650",
                methods: ["GET"],
            },
            name: "Madrid Hop-on Hop-off Bus Tour",
            shortDescription: "Explore Madrid at your own pace with a hop-on hop-off sightseeing bus ticket.",
            geoCode: {
                latitude: "40.420000",
                longitude: "-3.705000",
            },
            rating: "4.2",
            pictures: ["https://images.musement.com/cover/0009/25/hop-on-hop-off-madrid.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Bus505",
            price: {
                currencyCode: "EUR",
                amount: "30.00",
            },
        },
        {
            id: "23651",
            type: "activity",
            self: {
                href: "https://test.api.amadeus.com/v1/shopping/activities/23651",
                methods: ["GET"],
            },
            name: "Cooking Class: Paella and Sangria",
            shortDescription:
                "Learn how to cook Spain’s most famous dish and prepare refreshing sangria with a local chef.",
            geoCode: {
                latitude: "40.421000",
                longitude: "-3.699000",
            },
            rating: "5.0",
            pictures: ["https://images.musement.com/cover/0010/30/paella-class.jpeg?w=500"],
            bookingLink: "https://b2c.mla.cloud/c/QCejqyor?c=Cooking606",
            price: {
                currencyCode: "EUR",
                amount: "60.00",
            },
        },
    ],
};


export default activitiesMock;
