import mysql.connector
import pandas as pd
import json

# Connect to MySQL
try:
    db = mysql.connector.connect(
        host="localhost",
        user="root",
        password="2217",
        database="ngosales_db"
    )
    cursor = db.cursor()

    # Fetch all columns dynamically
    cursor.execute("SHOW COLUMNS FROM ngo_product_sales")
    columns = [column[0] for column in cursor.fetchall()]  # Extract column names

    print("🔹 Columns Retrieved:", columns)  # Debugging step

    # Fetch all rows
    cursor.execute("SELECT * FROM ngo_product_sales")
    data = cursor.fetchall()

    if not data:
        print(" No data found in the table.")
    else:
        # Convert to DataFrame
        df = pd.DataFrame(data, columns=columns)

        # Save directly as JSON file
        json_data = df.to_json(orient="records", indent=4)  
        with open("output.json", "w") as f:
            f.write(json_data)
        
        print(" All rows and columns fetched and saved to output.json")

except mysql.connector.Error as err:
    print(" MySQL Error:", err)

except Exception as e:
    print(" Error:", e)