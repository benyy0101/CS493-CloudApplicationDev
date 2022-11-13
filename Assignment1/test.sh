curl --request GET \
  --url http://localhost:8000/business \
  --header 'Content-Type: application/json'

curl --request GET \
  --url http://localhost:8000/business/1 \
  --header 'Content-Type: application/json'

curl --request GET \
  --url http://localhost:8000/review \
  --header 'Content-Type: application/json'

curl --request GET \
  --url http://localhost:8000/photo \
  --header 'Content-Type: application/json'

curl --request POST \
  --url http://localhost:8000/business \
  --header 'Content-Type: application/json' \
  --data '{
        "Name": "Example 7",
        "Address": "671 SW 26th St",
        "City": "Corvallis",
        "State": "OR",
        "ZIP":"97333",
        "Phone":"321-321-4321",
        "Category":"Restaurant",
        "Subcategory":"Pizza"
    }'

curl --request POST \
  --url http://localhost:8000/business \
  --header 'Content-Type: application/json' \
  --data '{
        "Address": "671 SW 26th St",
        "City": "Corvallis",
        "State": "OR",
        "ZIP":"97333",
        "Phone":"321-321-4321",
        "Category":"Restaurant",
        "Subcategory":"Pizza",
        "Website":"Optional",
        "Email":"Optional"
    }'

curl --request POST \
  --url http://localhost:8000/review/4 \
  --header 'Content-Type: application/json' \
  --data '{
        "BusinessId":1,
        "StarRating":1,
        "PriceRating":"$$$",
        "WrittenReview":"Not bad"
    }'

curl --request POST \
  --url http://localhost:8000/review/4 \
  --header 'Content-Type: application/json' \
  --data '{
        "BusinessId":4,
        "StarRating":1,
        "PriceRating":"$$$",
        "WrittenReview":"Not bad"
    }'

curl --request POST \
  --url http://localhost:8000/photo/2 \
  --header 'Content-Type: application/json' \
  --data '{
        "BusinessId":1,
        "Photo":"image.png",
        "Caption":"Pizza"
    }'

curl --request PUT \
  --url http://localhost:8000/business/1 \
  --header 'Content-Type: application/json' \
  --data '{
        "ID": 1,
        "Name": "Example 1",
        "Address": "671 SW 26th St",
        "City": "Corvallis",
        "State": "OR",
        "ZIP":"97333",
        "Phone":"321-321-4321",
        "Category":"Restaurant",
        "Subcategory":"Pizza",
        "Website":"Optional",
        "Email":"Optional"
    }'

curl --request PUT \
  --url http://localhost:8000/review/1 \
  --header 'Content-Type: application/json' \
  --data ' {
        "BusinessId":2,
        "StarRating":2,
        "PriceRating":"$$$",
        "WrittenReview":"Not bad"
    }'

curl --request PUT \
  --url http://localhost:8000/photo/1 \
  --header 'Content-Type: application/json' \
  --data '{
        "BusinessId":1,
        "Photo":"image.png",
        "Caption":"Pizza"
    }'

curl --request DELETE \
  --url http://localhost:8000/business/1 \
  --header 'Content-Type: application/json' \


curl --request DELETE \
  --url http://localhost:8000/business/7 \
  --header 'Content-Type: application/json' \
 

curl --request DELETE \
  --url http://localhost:8000/review/1 \
  --header 'Content-Type: application/json'

curl --request DELETE \
  --url http://localhost:8000/review/7 \
  --header 'Content-Type: application/json'

curl --request DELETE \
  --url http://localhost:8000/photo/1 \
  --header 'Content-Type: application/json'

curl --request DELETE \
  --url http://localhost:8000/photo/8 \
  --header 'Content-Type: application/json'