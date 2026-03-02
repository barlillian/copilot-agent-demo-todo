# 項目管理範例 (Python)
import requests

API = 'http://localhost:3000/api'
TOKEN = ''

# 登入取得 token
def login():
    global TOKEN
    res = requests.post(f'{API}/users/login', json={
        'email': 'alice@example.com',
        'password': '123456'
    })
    TOKEN = res.json()['data']['token']

# 建立項目
def create_project():
    res = requests.post(f'{API}/projects',
        headers={'Authorization': f'Bearer {TOKEN}'},
        json={'name': '教學專案', 'description': 'API 教學用'}
    )
    return res.json()

# 查詢參與項目
def get_projects():
    res = requests.get(f'{API}/projects', headers={'Authorization': f'Bearer {TOKEN}'})
    return res.json()

# 新增成員
def add_member(project_id, user_id):
    res = requests.post(f'{API}/projects/{project_id}/members',
        headers={'Authorization': f'Bearer {TOKEN}'},
        json={'userId': user_id}
    )
    return res.json()

if __name__ == '__main__':
    login()
    project = create_project()
    print('建立項目:', project)
    projects = get_projects()
    print('查詢項目:', projects)
    # 假設有第二位用戶 id=2
    if projects['data']:
        added = add_member(projects['data'][0]['id'], 2)
        print('新增成員:', added)
