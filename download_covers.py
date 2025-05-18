#!/usr/bin/env python3
import os
import requests
import json
import time
import re

# Book titles from our init.sql
books = [
    'Moby-Dick', 'The Odyssey', 'War and Peace', 'Crime and Punishment', 'Jane Eyre', 
    'Wuthering Heights', 'Great Expectations', 'The Brothers Karamazov', 'Animal Farm', 
    'The Grapes of Wrath', 'Little Women', 'Catch-22', 'The Alchemist', 'Don Quixote', 
    'Fahrenheit 451', 'Slaughterhouse-Five', 'Dracula', 'Frankenstein', 'Les Misérables', 
    'The Picture of Dorian Gray', 'A Tale of Two Cities', 'The Scarlet Letter', 
    'The Adventures of Huckleberry Finn', 'The Old Man and the Sea', 'One Hundred Years of Solitude', 
    'The Chronicles of Narnia', 'Dune', 'The Shining', 'The Sun Also Rises', 'Rebecca', 
    'A Passage to India', 'The Kite Runner', 'The Girl with the Dragon Tattoo', 
    'Memoirs of a Geisha', 'The Handmaid\'s Tale', 'Gone with the Wind', 'Life of Pi', 
    'The Hunger Games', 'Ender\'s Game', 'The Road', 'The Fault in Our Stars', 
    'Beloved', 'The Book Thief', 'The Secret Garden', 'A Clockwork Orange', 
    'Lolita', 'Persuasion', 'Murder on the Orient Express', 'The Count of Monte Cristo', 
    'Treasure Island', 'The Hitchhiker\'s Guide to the Galaxy', 'Charlotte\'s Web'
]

# Create directory for book covers if it doesn't exist
covers_dir = '/Users/simonmikolajek/Repos/library-management-system/backend/LibraryAPI/wwwroot/uploads/covers'
os.makedirs(covers_dir, exist_ok=True)

# Define a function to sanitize filenames
def sanitize_filename(filename):
    # Replace special characters with underscores
    return re.sub(r'[\\/*?:"<>|]', "_", filename)

# Download book covers
for i, book_title in enumerate(books, 1):
    # Create a sanitized filename
    safe_title = sanitize_filename(book_title)
    file_path = os.path.join(covers_dir, f"{i}_{safe_title}.jpg")
    
    # Skip if the file already exists
    if os.path.exists(file_path):
        print(f"Cover for {book_title} already exists, skipping...")
        continue
    
    # Use Open Library API to search for book
    search_url = f"https://openlibrary.org/search.json?title={book_title}&limit=1"
    print(f"Searching for {book_title}...")
    
    try:
        response = requests.get(search_url)
        data = response.json()
        
        if data.get('docs') and len(data['docs']) > 0:
            book = data['docs'][0]
            
            # Check if book has a cover ID
            if 'cover_i' in book:
                cover_id = book['cover_i']
                # Use the Large size cover (M for medium, S for small)
                cover_url = f"https://covers.openlibrary.org/b/id/{cover_id}-L.jpg"
                
                # Download the cover
                print(f"Downloading cover for {book_title}...")
                img_response = requests.get(cover_url)
                
                # Save the image
                if img_response.status_code == 200:
                    with open(file_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"Cover saved for {book_title} at {file_path}")
                else:
                    print(f"Failed to download cover for {book_title}")
            else:
                print(f"No cover found for {book_title}")
        else:
            print(f"No results found for {book_title}")
    except Exception as e:
        print(f"Error processing {book_title}: {e}")
    
    # Sleep to respect rate limits
    time.sleep(1)

print("Finished downloading book covers")

# Generate SQL update statements
update_sql = """-- Update SQL to set cover image paths
"""

for i, book_title in enumerate(books, 1):
    safe_title = sanitize_filename(book_title)
    relative_path = f"/uploads/covers/{i}_{safe_title}.jpg"
    update_sql += f"UPDATE \"Books\" SET \"CoverImagePath\" = '{relative_path}' WHERE \"Id\" = {i};\n"

# Save the SQL file
with open('/Users/simonmikolajek/Repos/library-management-system/database/init.sql/update_covers.sql', 'w') as f:
    f.write(update_sql)

print("Generated SQL update statements")
