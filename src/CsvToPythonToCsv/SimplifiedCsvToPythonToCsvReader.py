import csv

with open('Combined_ephys_for_modelling_curated_OptEnsemble_v2.csv', 'r') as csv_file: #this chunk can be modified to take in a csv created by JS
    csv_reader = csv.DictReader(csv_file)
    list_of_fields = csv_reader.fieldnames


#Here any calculations can be done in Python, then written to another CSV file
#
#
#
#

    with open('.\DataExampleCalculationOutput.csv', 'w') as new_file:
        fieldnames = list_of_fields

        csv_writer = csv.DictWriter(new_file, fieldnames=fieldnames, delimiter=',')

        csv_writer.writeheader()

        for line in csv_reader:
            csv_writer.writerow(line)


