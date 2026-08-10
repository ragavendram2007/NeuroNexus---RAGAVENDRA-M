import pdfplumber
import re

def extract_pdf_structure(pdf_path: str):
    """
    Parses a PDF file and returns a structured list of pages, text chunks, 
    and coordinate bounding boxes for every sentence.
    This handles double-column layouts by sorting words into columns before building sentences.
    Uses pdfplumber for pure Python execution (no C++ compilers required).
    """
    structured_data = []
    
    with pdfplumber.open(pdf_path) as pdf:
        for page_idx, page in enumerate(pdf.pages):
            width = float(page.width)
            mid_x = width / 2.0
            
            # Extract all words: list of dicts with {'x0', 'top', 'x1', 'bottom', 'text'}
            words = page.extract_words()
            if not words:
                continue
                
            left_col = []
            right_col = []
            
            for w in words:
                x0 = float(w['x0'])
                y0 = float(w['top'])
                x1 = float(w['x1'])
                y1 = float(w['bottom'])
                text = w['text']
                
                w_mid = (x0 + x1) / 2.0
                word_item = (x0, y0, x1, y1, text)
                
                if w_mid < mid_x:
                    left_col.append(word_item)
                else:
                    right_col.append(word_item)
            
            # Sort words in columns: primary is y-coordinate (top-to-bottom), secondary is x-coordinate
            # We round y0 to nearest 3 units to group words into lines
            left_col.sort(key=lambda x: (int(x[1] / 3) * 3, x[0]))
            right_col.sort(key=lambda x: (int(x[1] / 3) * 3, x[0]))
            
            # Reconstruct reading flow
            sorted_words = left_col + right_col
            
            # Fallback if single-column layout
            if len(right_col) < 5 or len(left_col) < 5:
                sorted_words = list(words)
                sorted_words = [(float(w['x0']), float(w['top']), float(w['x1']), float(w['bottom']), w['text']) for w in sorted_words]
                sorted_words.sort(key=lambda x: (int(x[1] / 3) * 3, x[0]))

            sentences = []
            current_sentence = []
            
            for w in sorted_words:
                x0, y0, x1, y1, text = w
                current_sentence.append({
                    "text": text,
                    "bbox": [x0, y0, x1, y1]
                })
                
                # Check sentence boundaries
                if text.endswith(('.', '?', '!')) and len(text) > 1:
                    sentence_text = " ".join([item["text"] for item in current_sentence])
                    
                    # Group coordinates by line for multi-line highlight boxes
                    line_bboxes = {}
                    for item in current_sentence:
                        line_id = int(item["bbox"][1] / 3) * 3
                        if line_id not in line_bboxes:
                            line_bboxes[line_id] = list(item["bbox"])
                        else:
                            line_bboxes[line_id][0] = min(line_bboxes[line_id][0], item["bbox"][0])
                            line_bboxes[line_id][1] = min(line_bboxes[line_id][1], item["bbox"][1])
                            line_bboxes[line_id][2] = max(line_bboxes[line_id][2], item["bbox"][2])
                            line_bboxes[line_id][3] = max(line_bboxes[line_id][3], item["bbox"][3])
                    
                    sentences.append({
                        "text": sentence_text,
                        "page": page_idx,
                        "rects": list(line_bboxes.values())
                    })
                    current_sentence = []
            
            # Flush remaining words
            if current_sentence:
                sentence_text = " ".join([item["text"] for item in current_sentence])
                line_bboxes = {}
                for item in current_sentence:
                    line_id = int(item["bbox"][1] / 3) * 3
                    if line_id not in line_bboxes:
                        line_bboxes[line_id] = list(item["bbox"])
                    else:
                        line_bboxes[line_id][0] = min(line_bboxes[line_id][0], item["bbox"][0])
                        line_bboxes[line_id][1] = min(line_bboxes[line_id][1], item["bbox"][1])
                        line_bboxes[line_id][2] = max(line_bboxes[line_id][2], item["bbox"][2])
                        line_bboxes[line_id][3] = max(line_bboxes[line_id][3], item["bbox"][3])
                
                sentences.append({
                    "text": sentence_text,
                    "page": page_idx,
                    "rects": list(line_bboxes.values())
                })
                
            structured_data.extend(sentences)
            
    return structured_data

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        data = extract_pdf_structure(sys.argv[1])
        print(f"Extracted {len(data)} sentences.")
        if data:
            print("First sentence:", data[0])
