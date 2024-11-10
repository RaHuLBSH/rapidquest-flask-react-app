from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

# Paths to static JSON files (replace with actual paths to your JSON files)
USER_DATA_FILE = 'data/users.json'
PRODUCT_DATA_FILE = 'data/products.json'
SALES_DATA_FILE = 'data/sales.json'
CUSTOMER_DATA_FILE = 'data/customers.json'

def read_json_file(file_path):
    """Helper function to read data from a JSON file."""
    if not os.path.exists(file_path):
        return []
    with open(file_path, 'r') as f:
        return json.load(f)

@app.route('/sales_over_time', methods=['GET'])
def sales_over_time():
    interval = request.args.get('interval', 'daily')  # Default to daily
    growth = request.args.get('growth', False)

    # Read sales data from the JSON file
    sales_data = read_json_file(SALES_DATA_FILE)

    # Set up the format for different intervals
    if interval == 'daily':
        format = '%Y-%m-%d'
    elif interval == 'monthly':
        format = '%Y-%m'
    elif interval == 'quarterly':
        format = None  # Handle quarterly separately
    elif interval == 'yearly':
        format = '%Y'
    else:
        return jsonify({"error": "Invalid interval"}), 400

    # Group sales by interval (daily, monthly, quarterly, yearly)
    grouped_sales = {}
    for sale in sales_data:
        sale_date = sale['sale_date'][:10]  # Assuming `sale_date` is in the format 'YYYY-MM-DD'
        if interval == 'monthly':
            sale_date = sale['sale_date'][:7]  # Group by 'YYYY-MM'
        elif interval == 'quarterly':
            # Determine the quarter based on the month
            month = int(sale['sale_date'][5:7])
            quarter = (month - 1) // 3 + 1
            sale_date = f"{sale['sale_date'][:4]}-Q{quarter}"
        elif interval == 'yearly':
            sale_date = sale['sale_date'][:4]  # Group by 'YYYY'

        if sale_date not in grouped_sales:
            grouped_sales[sale_date] = 0
        grouped_sales[sale_date] += sale['total_price']

    sorted_sales = [{'date': date, 'totalSales': total} for date, total in sorted(grouped_sales.items())]

    if growth:
        growth_rate = []
        for i in range(1, len(sorted_sales)):
            previous = sorted_sales[i-1]['totalSales']
            current = sorted_sales[i]['totalSales']
            growth = ((current - previous) / previous) * 100 if previous != 0 else 0
            growth_rate.append({'date': sorted_sales[i]['date'], 'growthRate': growth})
        return jsonify(growth_rate)
    else:
        return jsonify(sorted_sales)


@app.route('/new_customers', methods=['GET'])
def new_customers_over_time():
    interval = request.args.get('interval', 'daily')  # Default to daily
    
    # Read customer data from JSON file
    customers_data = read_json_file(USER_DATA_FILE)

    # Set up the format for different intervals
    if interval == 'daily':
        format = '%Y-%m-%d'
    elif interval == 'monthly':
        format = '%Y-%m'
    elif interval == 'quarterly':
        format = None  # Handle quarterly separately
    elif interval == 'yearly':
        format = '%Y'
    else:
        return jsonify({"error": "Invalid interval"}), 400

    # Group customers by interval (daily, monthly, quarterly, yearly)
    grouped_customers = {}
    for customer in customers_data:
        customer_date = customer['created_at'][:10]  # Assuming `created_at` is in the format 'YYYY-MM-DD'
        if interval == 'monthly':
            customer_date = customer['created_at'][:7]  # Group by 'YYYY-MM'
        elif interval == 'quarterly':
            # Determine the quarter based on the month
            month = int(customer['created_at'][5:7])
            quarter = (month - 1) // 3 + 1
            customer_date = f"{customer['created_at'][:4]}-Q{quarter}"
        elif interval == 'yearly':
            customer_date = customer['created_at'][:4]  # Group by 'YYYY'

        if customer_date not in grouped_customers:
            grouped_customers[customer_date] = 0
        grouped_customers[customer_date] += 1

    sorted_customers = [{'date': date, 'newCustomers': total} for date, total in sorted(grouped_customers.items())]

    return jsonify(sorted_customers)


@app.route('/repeat_customers', methods=['GET'])
def repeat_customers_over_time():
    interval = request.args.get('interval', 'daily')  # Default to daily
    
    # Read sales data from JSON file
    sales_data = read_json_file(SALES_DATA_FILE)

    # Set up the format for different intervals
    if interval == 'daily':
        format = '%Y-%m-%d'
    elif interval == 'monthly':
        format = '%Y-%m'
    elif interval == 'quarterly':
        format = None  # Handle quarterly separately
    elif interval == 'yearly':
        format = '%Y'
    else:
        return jsonify({"error": "Invalid interval"}), 400

    # Group repeat customers by interval (daily, monthly, quarterly, yearly)
    repeat_customers = {}
    customer_orders = {}

    for sale in sales_data:
        customer_id = sale['user_id']
        sale_date = sale['sale_date'][:10]  # Assuming `sale_date` is in the format 'YYYY-MM-DD'
        if interval == 'monthly':
            sale_date = sale['sale_date'][:7]  # Group by 'YYYY-MM'
        elif interval == 'quarterly':
            # Determine the quarter based on the month
            month = int(sale['sale_date'][5:7])
            quarter = (month - 1) // 3 + 1
            sale_date = f"{sale['sale_date'][:4]}-Q{quarter}"
        elif interval == 'yearly':
            sale_date = sale['sale_date'][:4]  # Group by 'YYYY'

        if customer_id not in customer_orders:
            customer_orders[customer_id] = []
        customer_orders[customer_id].append(sale_date)

    for customer_id, orders in customer_orders.items():
        for date in orders:
            if date not in repeat_customers:
                repeat_customers[date] = set()
            repeat_customers[date].add(customer_id)

    sorted_repeat_customers = [{'date': date, 'repeatCustomers': len(customers)} for date, customers in sorted(repeat_customers.items())]

    return jsonify(sorted_repeat_customers)


@app.route('/customer_distribution', methods=['GET'])
def customer_distribution():
    customer_data = read_json_file(CUSTOMER_DATA_FILE)
    
    distribution = {}
    for customer in customer_data:
        city = customer['city']
        if city not in distribution:
            distribution[city] = {
                'count': 0,
                'latitude': customer['latitude'],
                'longitude': customer['longitude']
            }
        distribution[city]['count'] += 1

    result = [
        {
            'city': city,
            'latitude': details['latitude'],
            'longitude': details['longitude'],
            'count': details['count']
        }
        for city, details in distribution.items()
    ]
    
    return jsonify(result)



@app.route('/clv_by_cohorts', methods=['GET'])
def clv_by_cohorts():
    sales_data = read_json_file(SALES_DATA_FILE)

    # Group sales by customer and month
    cohort_data = {}
    for sale in sales_data:
        customer_id = sale['sale_id']
        sale_month = sale['sale_date'][:7]  # Extract the month 'YYYY-MM'
        total_price = sale['total_price']

        if customer_id not in cohort_data:
            cohort_data[customer_id] = {}
        if sale_month not in cohort_data[customer_id]:
            cohort_data[customer_id][sale_month] = 0
        cohort_data[customer_id][sale_month] += total_price

    # Aggregate cohort data
    cohort_sales = {}
    for customer_id, monthly_sales in cohort_data.items():
        for month, total_spent in monthly_sales.items():
            if month not in cohort_sales:
                cohort_sales[month] = 0
            cohort_sales[month] += total_spent

    sorted_cohorts = [{'month': month, 'lifetimeValue': total} for month, total in sorted(cohort_sales.items())]

    return jsonify(sorted_cohorts)


@app.route('/')
def index():
    return "Welcome to the Flask API"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
