# Usando a imagem oficial do RabbitMQ com management
FROM rabbitmq:management

# Expondo portas para comunicação e interface de gerenciamento
EXPOSE 5672 15672

# Definindo variáveis de ambiente para usuário e senha padrão do RabbitMQ
ENV RABBITMQ_DEFAULT_USER=admin
ENV RABBITMQ_DEFAULT_PASS=0239
