import random
from datetime import datetime, timedelta

# Sample Data
products = [
    ("Eco-Friendly Bags", "Environment"), ("Reusable Water Bottles", "Environment"),
    ("Solar Lanterns", "Energy"), ("Sanitary Kits", "Health"),
    ("School Kits", "Education"), ("Organic Seeds", "Agriculture"),
    ("Handmade Soaps", "Health"), ("Water Filters", "Health"),
    ("Eco-Friendly Utensils", "Environment"), ("First Aid Kits", "Health")
]

locations = ["Bhubaneswar", "Cuttack", "Puri", "Sambalpur", "Rourkela"]
sales_managers = ["Amit Kumar", "Rakesh Das", "Priya Sahu", "Suman Behera", "Rajesh Nayak"]
branches = ["Ama Odisha", "Seva Odisha", "Utkal Jyoti", "Swasthya Odisha"]
campaigns = ["Green Earth Drive", "Clean Water Initiative", "Health First", "Education for All"]
donors = ["EcoFund", "WaterAid", "HealthTrust", "EduCare"]
delivery_modes = ["Direct", "Online"]
conditions = ["New", "Refurbished"]

# Function to generate random date
def random_date():
    start_date = datetime(2023, 1, 1)
    end_date = datetime(2024, 6, 30)
    return start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

# Create SQL file
with open("insert_data.sql", "w") as file:
    file.write("USE ngosales_db;\n\n")  # Ensure database selection

    for i in range(50, 101):  # Generating records from ID 50 to 100
        product, category = random.choice(products)
        unit_cost = round(random.uniform(2, 20), 2)
        selling_price = unit_cost * random.uniform(1.5, 2.5)
        quantity_sold = random.randint(100, 2000)
        total_revenue = round(selling_price * quantity_sold, 2)
        beneficiaries = random.randint(100, 1000)
        location = random.choice(locations)
        sales_date = random_date().strftime('%Y-%m-%d')
        sales_manager = random.choice(sales_managers)
        ngo_branch = random.choice(branches)
        campaign_name = random.choice(campaigns)
        donor_name = random.choice(donors)
        funds_allocated = round(total_revenue * random.uniform(1.2, 2.0), 2)
        funds_utilized = round(total_revenue * random.uniform(0.8, 1.2), 2)
        notes = "Generated record"
        status = random.choice(["Completed", "Ongoing"])
        product_condition = random.choice(conditions)
        delivery_mode = random.choice(delivery_modes)

        # Generate SQL INSERT statement
        insert_sql = f"""
        INSERT INTO ngo_product_sales 
        (Product_ID, Product_Name, Category, Unit_Cost_USD, Selling_Price_USD, Quantity_Sold, 
        Total_Revenue_USD, Beneficiaries, Location, Sales_Date, Sales_Manager, NGO_Branch, 
        Campaign_Name, Donor_Name, Funds_Allocated_USD, Funds_Utilized_USD, Notes, Status, 
        Product_Condition, Delivery_Mode) 
        VALUES 
        ('{i:03d}', '{product}', '{category}', {unit_cost}, {selling_price}, {quantity_sold}, 
        {total_revenue}, {beneficiaries}, '{location}', '{sales_date}', '{sales_manager}', 
        '{ngo_branch}', '{campaign_name}', '{donor_name}', {funds_allocated}, {funds_utilized}, 
        '{notes}', '{status}', '{product_condition}', '{delivery_mode}');\n"""
        
        file.write(insert_sql)

print("✅ SQL file 'insert_data.sql' generated successfully!")
