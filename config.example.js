module.exports = {
    development: {
        clientUrl: 'http://localhost',
        clientPort: 8080,
        wsPort: 2020,
        cardReaderPort: 234,
        database: {
            client: 'mysql',
            connection: {
                host: 'db',
                port: 3306,
                user: 'root',
                password: 'example',
                database: 'pingpong',
            },
            migrations: {
                directory: __dirname + '/migrations',
                tableName: 'migrations'
            },
            pool: {
                min: 0,
                max: 10,
                createTimeoutMillis: 3000,
                acquireTimeoutMillis: 30000,
                idleTimeoutMillis: 30000,
                reapIntervalMillis: 1000,
                createRetryIntervalMillis: 100,
                propagateCreateError: false
            },
        }
    },
    production: {
        clientUrl: 'localhost',
        clientPort: 83,
        wsPort: 84,
        database: {
            client: 'mysql',
            connection: {
                host: 'localhost',
                port: 3306,
                user: 'root',
                password: 'root',
                database: 'ballgame',
            },
            migrations: {
                directory: __dirname + '/migrations',
                tableName: 'migrations'
            }
        },
        cardReaderPort: 123
    },
    global: {
        sparkCore: {
            accessToken: undefined,
            id: undefined
        },
        serverSwitchLimit: 2, // How many points before service switches
        serverSwitchThreshold: 10, // When both players have reached this threshold, the server switches every time
        maxScore: 11,
        mustWinBy: 2,
        minPlayers: 2,
        maxPlayers: 4,
        winningViewDuration: 6000, // The duration to show the winning view for before returning to the leaderboard
        feelers: {
            pingInterval: 3000,
            pingThreshold: 250,
            undoThreshold: 1500
        },
        cardReader: {
            pingInterval: 3000,
            pingThreshold: 250
        },
        tts: {
            key: '',
            language: 'en-us'
        }
    }
};
