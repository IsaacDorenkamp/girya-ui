interface Config {
	api_host: string;
};

let config: Config;

// TODO - change per environment
config = {
	api_host: "http://localhost:8000",
};

export default config;
