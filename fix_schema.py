import psycopg2

def fix_schema():
    try:
        # Connect to the nexus_db database
        conn = psycopg2.connect(
            dbname="nexus_db",
            user="postgres",
            password="Anas@Dev19",
            host="localhost",
            port="5432"
        )
        conn.autocommit = True
        cursor = conn.cursor()
        
        print("Connected to nexus_db. Attempting to update schema...")
        
        # Alter the column type with explicit cast
        cursor.execute("ALTER TABLE users ALTER COLUMN is_active TYPE SMALLINT USING (CASE WHEN is_active THEN 1 ELSE 0 END);")
        
        print("Column 'is_active' successfully changed to SMALLINT.")
        
        cursor.close()
        conn.close()
        print("Migration complete.")

    except Exception as e:
        print(f"Error updating schema: {e}")

if __name__ == "__main__":
    fix_schema()
