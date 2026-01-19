import os

def split_file(input_filename, lines_per_file=1500):
    # Check if file exists
    if not os.path.exists(input_filename):
        print(f"Error: The file '{input_filename}' was not found.")
        return

    try:
        with open(input_filename, 'r', encoding='utf-8', errors='ignore') as infile:
            file_number = 1
            current_lines = []
            
            for line in infile:
                current_lines.append(line)
                
                # If we reached the limit, write to a new file
                if len(current_lines) >= lines_per_file:
                    output_filename = f"{os.path.splitext(input_filename)[0]}_part_{file_number}.txt"
                    with open(output_filename, 'w', encoding='utf-8') as outfile:
                        outfile.writelines(current_lines)
                    
                    print(f"Created: {output_filename}")
                    file_number += 1
                    current_lines = [] # Reset for next batch

            # Write any remaining lines to the final file
            if current_lines:
                output_filename = f"{os.path.splitext(input_filename)[0]}_part_{file_number}.txt"
                with open(output_filename, 'w', encoding='utf-8') as outfile:
                    outfile.writelines(current_lines)
                print(f"Created: {output_filename}")

            print("Splitting complete!")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    split_file("all.txt", 1500)