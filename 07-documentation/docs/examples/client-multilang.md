# 多語言客戶端範例

## JavaScript (fetch)
```js
fetch('http://localhost:3000/api/tasks', {
  headers: { 'Authorization': 'Bearer <token>' }
})
  .then(res => res.json())
  .then(console.log)
```

## Python (requests)
```python
import requests
res = requests.get('http://localhost:3000/api/tasks', headers={'Authorization': 'Bearer <token>'})
print(res.json())
```

## cURL
```bash
curl -H "Authorization: Bearer <token>" http://localhost:3000/api/tasks
```

## Go (net/http)
```go
package main
import (
  "fmt"
  "net/http"
  "io/ioutil"
)
func main() {
  req, _ := http.NewRequest("GET", "http://localhost:3000/api/tasks", nil)
  req.Header.Set("Authorization", "Bearer <token>")
  client := &http.Client{}
  resp, _ := client.Do(req)
  defer resp.Body.Close()
  body, _ := ioutil.ReadAll(resp.Body)
  fmt.Println(string(body))
}
```
