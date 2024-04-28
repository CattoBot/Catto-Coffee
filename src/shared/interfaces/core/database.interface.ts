interface DatabaseConfig {
    MySQL: {
        URI: string;
        Credentials: {
            Host: string;
            Port: number;
            Password: string;
            Database: string;
        }
    }
    Mongo: {
        URI: string;
    };
    Redis: {
        Host: string;
        Port: number;
    };
}

export type Database = DatabaseConfig;