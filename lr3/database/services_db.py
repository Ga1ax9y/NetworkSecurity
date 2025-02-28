services = {
    "fileservice": {
        "secret_key": "fileservice_secret_key"
    },
    "printservice": {
        "secret_key": "printservice_secret_key"
    }
}

def get_service(service_name):
    return services.get(service_name)

def get_service(service_name):
    return services.get(service_name)
