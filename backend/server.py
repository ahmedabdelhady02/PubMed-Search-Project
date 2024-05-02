from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import xml.etree.ElementTree as ET

app = Flask(__name__)
CORS(app)

API_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"


@app.route("/search", methods=["POST"])
def search_publications():
    # extract data from POST request body
    data = request.get_json()
    query = data.get("query")  # query to be searched
    retstart = data.get("retstart", 0)  # pagination offset
    retmax = data.get("retmax", 20)  # total number of UIDS to be shown

    search_url = f"{API_URL}esearch.fcgi?db=pubmed&term={query}&retstart={retstart}&retmax={retmax}"
    response = requests.get(search_url)
    results = response.text

    # create element tree from XML response
    root = ET.fromstring(results)

    # find all <Id> tags and put them in a list
    ids = [id.text for id in root.findall(".//Id")]

    return jsonify({"ids": ids})


@app.route("/details", methods=["GET"])
def get_details():
    # request body contains:
    #   - ids: list of target IDs
    #   - fields: list of fields to return
    ids = request.args.get("ids")
    fields = request.args.get("fields")
    # default values if no fields specified
    if fields is None:
        fields = [
            "PMID",
            "Title",
            "Abstract",
            "AuthorList",
            "Journal",
            "PublicationYear",
            "MeSHTerms",
        ]

    fetch_url = f"{API_URL}efetch.fcgi?db=pubmed&id={ids}&retmode=xml"
    response = requests.get(fetch_url)
    results = response.text

    root = ET.fromstring(results)
    details = []
    for article in root.findall(".//PubmedArticle"):
        detail = {}
        if "PMID" in fields:
            detail["PMID"] = article.find(".//PMID").text

        if "Title" in fields:
            title_element = article.find(".//ArticleTitle")
            if title_element is not None:
                # concatenate text content of ArticleTitle including text from child elements
                title = "".join(title_element.itertext()).strip()
            else:
                title = "Title not available."
            detail["Title"] = title

        if "Abstract" in fields:
            abstract_elements = article.findall(".//AbstractText")
            if abstract_elements:
                # concatenate text content of all AbstractText elements
                abstract = " ".join(
                    "".join(abstract_element.itertext()).strip()
                    for abstract_element in abstract_elements
                )
            else:
                abstract = "No abstract available."
            detail["Abstract"] = abstract

        if "AuthorList" in fields:
            author_list = article.find(".//AuthorList")
            if author_list is not None and author_list.findall(".//Author"):
                # extract authors' names
                authors = []
                for author in author_list.findall(".//Author"):
                    last_name_element = author.find(".//LastName")
                    if last_name_element is not None:
                        last_name = last_name_element.text
                    else:
                        last_name = ""

                    first_name_element = author.find(".//ForeName")
                    if first_name_element is not None:
                        first_name = first_name_element.text + " "
                    else:
                        first_name = ""

                    # edge case for collectives/organizations as authors
                    collective_name = author.find(".//CollectiveName")
                    if collective_name is not None:
                        last_name = collective_name.text
                        first_name = ""

                    authors.append(f"{first_name}{last_name}")
                detail["AuthorList"] = ", ".join(authors)

            else:  # no AuthorList element found
                detail["AuthorList"] = "No authors listed."

        if "Journal" in fields:
            journal_element = article.find(".//Journal/Title")
            if journal_element is not None:
                detail["Journal"] = journal_element.text
            else:
                detail["Journal"] = "Journal not available."

        if "PublicationYear" in fields:
            pub_year_element = article.find(".//JournalIssue/PubDate/Year")
            if pub_year_element is not None:
                detail["PublicationYear"] = pub_year_element.text
            else:
                detail["PublicationYear"] = "Year not available."

        if "MeSHTerms" in fields:
            detail["MeSHTerms"] = [
                mesh.text for mesh in article.findall(".//MeshHeading/DescriptorName")
            ]

        details.append(detail)

    return jsonify({"details": details})


if __name__ == "__main__":
    app.run(debug=True)
