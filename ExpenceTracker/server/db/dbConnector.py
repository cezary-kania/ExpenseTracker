import psycopg2
from configparser import ConfigParser

class DBConnector:
    def __init__(self):
        self.con_params = self.__config()
    def __config(self):
        filename='server/db/dbConfig.ini'
        section='postgresql'
        parser = ConfigParser()
        parser.read(filename)
        db = {}
        if parser.has_section(section):
            params = parser.items(section)
            for param in params:
                db[param[0]] = param[1]
        else:
            raise Exception('Section {0} not found in the {1} file'.format(section, filename))
        return db
    def __connect(self):
        return psycopg2.connect(**self.con_params)
    def GetUserTransactions(self, user_id):
        conn = self.__connect()
        cur = conn.cursor()
        sqlQuery = 'SELECT * FROM user_transaction where user_id = %s;'
        cur.execute(sqlQuery, (user_id,))
        transactions = cur.fetchall()
        cur.close()
        conn.close()
        return transactions
    def AddNewTransaction(self, **transaction):
        conn = self.__connect()
        cur = conn.cursor()
        sqlQuery = 'INSERT INTO user_transaction(id, title, amount, currency, user_id) VALUES (default, %s, %s, %s, %s);'
        cur.execute(sqlQuery, (transaction['title'], transaction['amount'],transaction['currency'],transaction['user_id']))
        conn.commit()
        cur.execute('SELECT COUNT(id) FROM user_transaction')
        newTransactionId = cur.fetchone()
        cur.close()
        conn.close()
        return newTransactionId
    def DeleteUserTransaction(self, transaction_id):
        conn = self.__connect()
        cur = conn.cursor()
        sqlQuery = 'DELETE FROM user_transaction WHERE id = %s'
        cur.execute(sqlQuery, (transaction_id,))
        conn.commit()
        cur.close()
        conn.close()
    def tmp(self):
        conn = self.__connect()
        cur = conn.cursor()
        cur.execute('SELECT COUNT(id) FROM user_transaction')
        print(cur.fetchone())
        cur.close()
        conn.close()
if __name__ == "__main__":
    connector = DBConnector()
    connector.tmp()