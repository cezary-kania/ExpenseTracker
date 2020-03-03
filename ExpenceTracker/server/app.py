from flask import Flask
from flask_restful import Resource, Api,reqparse
from flask_cors import CORS
from random import randint

from db.dbConnector import DBConnector
app = Flask(__name__)
CORS(app)
api = Api(app)
dbConnector = DBConnector()

class ExpenseTracker(Resource):
    def get(self):
        return [
            {
               "title":"Payment",
               "amount" : "500",
               "currency":"$",
               "transactionID" : "1"
            },
            {
                "title":"Book",
                "amount" : "-50",
                "currency":"$",
                "transactionID" : "2"
            },
            {
                "title":"ProteinBar",
                "amount" : "-10",
                "currency":"$",
                "transactionID" : "3"
            }
        ]
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('title')
        parser.add_argument('amount')
        parser.add_argument('currency')
        args = parser.parse_args()
        newTransactionId = dbConnector.AddNewTransaction(title=args['title'],amount=args['amount'], currency=args['currency'], user_id=1)
        return { 
            "transactionID" : newTransactionId
        }

class TransactionDelete(Resource):
    def delete(self,transactionID):
        dbConnector.DeleteUserTransaction(transactionID)
        return '',204
api.add_resource(ExpenseTracker, '/')
api.add_resource(TransactionDelete, '/<transactionID>')
if __name__ == '__main__':
    app.run(debug=True)