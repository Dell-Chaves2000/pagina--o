import pymongo
import random
import time

# Parâmetros de conexão
conexao_uri = "mongodb://localhost:27017/"
nome_banco_dados = "livraria"

contador = 1

try:
    # Registrar o tempo de início
    inicio = time.time()

    # Conectar ao MongoDB
    conexao_mongo = pymongo.MongoClient(conexao_uri)
    # Selecionar o banco de dados e a coleção
    banco_dado_mongo = conexao_mongo[nome_banco_dados]
    # Selecionar a coleção
    colecao = banco_dado_mongo["livros"]

    # Abre o arquivo CSV em modo de leitura
    # Abra o arquivo
    with open('livros.csv', 'r', newline='', encoding='utf-8') as file:
        # Leia a primeira linha
        linha = file.readline()
        # Continue lendo linha por linha até que não haja mais linhas
        while linha:
            partes = linha.split(';')
            if (len(partes) == 5):
                titulo = partes[0]
                titulo = titulo.replace("'", "")
                autor = partes[1]
                isbn = partes[2]
                paginas = partes[3]
                ano = partes[4]
                valor = round(random.uniform(40, 100), 2)

                produto = {
                    "titulo": titulo,
                    "autor": autor,
                    "isbn": isbn,
                    "paginas": int(paginas),
                    "ano": int(ano.replace('\n', '')),
                    "valor": valor
                }
                
                # Inserir o documento na coleção
                resultado = colecao.insert_one(produto)
                print(titulo)

            # Leia a próxima linha
            linha = file.readline()

    # Registrar o tempo de término
    fim = time.time()
    # Calcular o tempo decorrido
    tempo_decorrido = fim - inicio
    print("Tempo decorrido:", tempo_decorrido, "segundos")

except Exception as e:
    print("Ocorreu um erro:", e)
