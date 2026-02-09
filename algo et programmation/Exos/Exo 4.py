import csv
from datetime import datetime

def analyze_temperature_data(csv_filepath):

    lowest_min_temp = float('inf')
    highest_max_temp = float('-inf')
    total_temp_sum = 0
    record_count = 0
    department_temps = {}

    try:
        with open(csv_filepath, 'r', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)

            for row in reader:
                try:
                    department = row['departement']
                    date_str = row['date']
                    min_temp = float(row['temp_min'])
                    max_temp = float(row['temp_max'])
                    avg_temp = float(row['temp_moyenne'])

                    date = datetime.strptime(date_str, '%Y-%m-%d')

                    if min_temp < lowest_min_temp:
                        lowest_min_temp = min_temp
                        lowest_min_department = department
                        lowest_min_date = date_str

                    if max_temp > highest_max_temp:
                        highest_max_temp = max_temp
                        highest_max_department = department
                        highest_max_date = date_str

                    total_temp_sum += avg_temp
                    record_count += 1

                    if department not in department_temps:
                        department_temps[department] = []
                    department_temps[department].append(row)

                except (ValueError, KeyError) as e:
                    print(f"Skipping row due to an error: {e}")
                    continue

        if record_count > 0:
            average_temp = total_temp_sum / record_count
        else:
            average_temp = "N/A"

        # Output the results
        print("--- Analysis Results ---")
        print(f"Lowest Minimum Temperature: {lowest_min_temp}°C, Department: {lowest_min_department}, Date: {lowest_min_date}")
        print(f"Highest Maximum Temperature: {highest_max_temp}°C, Department: {highest_max_department}, Date: {highest_max_date}")
        print(f"Average Temperature (Overall): {average_temp:.2f}°C")

        print("\n--- Data Sorted by Department (First few rows) ---")
        for department, data in department_temps.items():
            print(f"Department: {department}")
            for row in data[:3]: 
                print(row)
            print("...")

    except FileNotFoundError:
        print(f"Error: The file '{csv_filepath}' was not found.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

csv_file = "temperature-quotidienne-departementale.csv"
analyze_temperature_data(csv_file)

