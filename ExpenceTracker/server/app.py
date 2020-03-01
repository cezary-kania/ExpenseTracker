from flask import Flask
from flask_restful import Resource, Api,reqparse
from flask_cors import CORS
from random import randint
app = Flask(__name__)
CORS(app)
api = Api(app)


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
        args['transactionID'] = randint(0,100)
        print(args)
        return { 
            "status" : "success",
            "transactionID" : args['transactionID']
        }

api.add_resource(ExpenseTracker, '/')

if __name__ == '__main__':
    app.run(debug=True)