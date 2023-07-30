from pdfminer.pdfinterp import PDFResourceManager, PDFPageInterpreter
from pdfminer.converter import TextConverter
from pdfminer.layout import LAParams
from pdfminer.pdfpage import PDFPage
from io import StringIO
from pymongo import MongoClient
import re
import sys

# 连接MongoDB数据库
client = MongoClient('mongodb://localhost:27017/')
db = client['tsdy']
collection = db['library']

# 基础信息设置
# 命令行调参
pdf_path = sys.argv[1]
title = sys.argv[2]
author = sys.argv[3]

# pdf_path = 'C:/Users/31065/Desktop/Note/最近阅读/VUE.pdf'
# title = 'VUE基础'
# author = '-未知-'

# 解析PDF文档并提取文本数据
def extract_text_from_pdf(pdf_path):
    rsrcmgr = PDFResourceManager()
    output_string = StringIO()
    codec = 'utf-8'
    laparams = LAParams()
    device = TextConverter(rsrcmgr, output_string, codec=codec, laparams=laparams)
    with open(pdf_path, 'rb') as fp:
        interpreter = PDFPageInterpreter(rsrcmgr, device)
        for page in PDFPage.get_pages(fp, check_extractable=True):
            interpreter.process_page(page)
    text = output_string.getvalue()
    device.close()
    output_string.close()
    return text

# 将提取的文本数据保存到MongoDB中
def save_text_to_mongodb(text):
    pattern1 = r"\n\d+\n"
    pattern2 = r"\d{3,}"
    pattern3 = r"\n●"
    filtered_text1 = re.sub(pattern1, "", text)
    filtered_text2 = re.sub(pattern2, "", filtered_text1)
    filtered_text3 = re.sub(pattern3, "", filtered_text2)

    chapterNumber = 0
    index = 0
    history = index
    content = ''
    result = {
        'title': title,
        'author': author,
        'chapters': [] 
    }
    values = filtered_text3.split("\n")
    for line in values:
        if( line != ''):
            content += line + "\n"
            index += 1
        if( (index+1)%50 == 0 and index > history):
            history = index
            # 遍历每个值，存储到数据库中
            data = {
                'chapterNumber': chapterNumber,
                'content': content
            }
            result['chapters'].append(data)            
            content = ''
            chapterNumber += 1

    collection.insert_one(result)
            

# 调用函数进行操作
text = extract_text_from_pdf(pdf_path)
save_text_to_mongodb(text)