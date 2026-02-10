#!/bin/bash

BASE="http://localhost:3000/api"
PASS=0
FAIL=0

run_test() {
  local NUM="$1"
  local METHOD="$2"
  local URL="$3"
  local DESC="$4"
  local DATA="$5"
  local TOKEN="$6"
  local EXPECTED="$7"

  local CMD="curl -s -o /tmp/resp_body.txt -w %{http_code}"

  if [ -n "$TOKEN" ]; then
    CMD="$CMD -H 'Authorization: Bearer $TOKEN'"
  fi
  CMD="$CMD -H 'Content-Type: application/json'"

  if [ "$METHOD" = "POST" ]; then
    CMD="$CMD -X POST"
    if [ -n "$DATA" ]; then
      CMD="$CMD -d '$DATA'"
    fi
  fi

  CMD="$CMD '$URL'"

  local HTTP_CODE=$(eval $CMD)
  local BODY=$(cat /tmp/resp_body.txt)
  local PRETTY=$(echo "$BODY" | python3 -m json.tool 2>/dev/null || echo "$BODY")

  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  if [ "$HTTP_CODE" = "$EXPECTED" ]; then
    echo "✅ PASS  #$NUM | $METHOD $DESC"
    PASS=$((PASS + 1))
  else
    echo "❌ FAIL  #$NUM | $METHOD $DESC"
    echo "   HTTP: $HTTP_CODE (ожидался: $EXPECTED)"
    FAIL=$((FAIL + 1))
  fi
  echo "$PRETTY" | head -30
}

echo "╔══════════════════════════════════════════════════════╗"
echo "║     ТЕСТИРОВАНИЕ API SCHEDULE_KEMSU_BACK            ║"
echo "╚══════════════════════════════════════════════════════╝"

run_test 1 GET "http://localhost:3000/health" "Health Check → 200" "" "" "200"
run_test 2 POST "$BASE/auth/login" "Login без данных → 400" '{}' "" "400"
run_test 3 POST "$BASE/auth/login" "Login неверный пароль → 401" '{"login":"petrov@kemsu.ru","password":"wrong"}' "" "401"

RESP=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"login":"petrov@kemsu.ru","password":"password123"}' "$BASE/auth/login")
TOKEN_L=$(echo "$RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
OK=$(echo "$RESP" | python3 -c "import sys,json; print('yes' if json.load(sys.stdin).get('success') else 'no')" 2>/dev/null)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$OK" = "yes" ]; then echo "✅ PASS  #4 | POST Login преподаватель (petrov)"; PASS=$((PASS+1)); else echo "❌ FAIL  #4 | POST Login преподаватель"; FAIL=$((FAIL+1)); fi
echo "$RESP" | python3 -m json.tool 2>/dev/null | head -15

RESP2=$(curl -s -X POST -H 'Content-Type: application/json' -d '{"login":"gaidai@kemsu.ru","password":"password123"}' "$BASE/auth/login")
TOKEN_H=$(echo "$RESP2" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)
OK2=$(echo "$RESP2" | python3 -c "import sys,json; print('yes' if json.load(sys.stdin).get('success') else 'no')" 2>/dev/null)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$OK2" = "yes" ]; then echo "✅ PASS  #5 | POST Login зав. кафедрой (gaidai)"; PASS=$((PASS+1)); else echo "❌ FAIL  #5 | POST Login зав. кафедрой"; FAIL=$((FAIL+1)); fi
echo "$RESP2" | python3 -m json.tool 2>/dev/null | head -15

run_test 6 GET "$BASE/auth/profile" "Profile без токена → 401" "" "" "401"
run_test 7 GET "$BASE/auth/profile" "Profile преподавателя → 200" "" "$TOKEN_L" "200"
run_test 8 GET "$BASE/groups" "Группы преподавателя → 200" "" "$TOKEN_L" "200"
run_test 9 GET "$BASE/groups" "Группы зав. кафедрой → 200" "" "$TOKEN_H" "200"
run_test 10 GET "$BASE/groups/1/work-groups" "Подгруппы base_group=1 → 200" "" "$TOKEN_L" "200"
run_test 11 GET "$BASE/students/work-group/1" "Студенты work_group=1 → 200" "" "$TOKEN_L" "200"
run_test 12 GET "$BASE/students/base-group/1" "Студенты base_group=1 → 200" "" "$TOKEN_L" "200"
run_test 13 GET "$BASE/schedule" "Расписание преподавателя → 200" "" "$TOKEN_L" "200"
run_test 14 GET "$BASE/schedule" "Расписание зав. кафедрой → 200" "" "$TOKEN_H" "200"
run_test 15 GET "$BASE/schedule/disciplines" "Дисциплины преподавателя → 200" "" "$TOKEN_L" "200"
run_test 16 GET "$BASE/schedule/discipline-plan/1/sessions" "Сессии плана 1 → 200" "" "$TOKEN_L" "200"
run_test 17 GET "$BASE/attendance/statuses" "Статусы посещаемости → 200" "" "$TOKEN_L" "200"
run_test 18 GET "$BASE/attendance/classrooms" "Аудитории → 200" "" "$TOKEN_L" "200"

HTTP19=$(curl -s -o /tmp/resp_body.txt -w %{http_code} -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN_L" -d '{"discipline_plan_id":1,"date":"2026-02-06","pair_number":1,"classroom_id":1}' "$BASE/attendance/sessions")
BD19=$(cat /tmp/resp_body.txt)
NEW_SID=$(echo "$BD19" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['id'])" 2>/dev/null)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$HTTP19" = "201" ]; then echo "✅ PASS  #19 | POST Создание сессии → 201"; PASS=$((PASS+1)); else echo "❌ FAIL  #19 | POST Создание сессии (HTTP=$HTTP19)"; FAIL=$((FAIL+1)); fi
echo "$BD19" | python3 -m json.tool 2>/dev/null | head -15

run_test 20 GET "$BASE/attendance/sessions/1" "Посещаемость сессии 1 → 200" "" "$TOKEN_L" "200"

if [ -z "$NEW_SID" ]; then NEW_SID=1; fi
HTTP21=$(curl -s -o /tmp/resp_body.txt -w %{http_code} -X POST -H 'Content-Type: application/json' -H "Authorization: Bearer $TOKEN_L" -d '{"records":[{"student_id":1,"attendance_status_id":1,"comment":""},{"student_id":2,"attendance_status_id":2,"comment":"Не пришёл"}]}' "$BASE/attendance/sessions/$NEW_SID/mark")
BD21=$(cat /tmp/resp_body.txt)
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$HTTP21" = "200" ]; then echo "✅ PASS  #21 | POST Отметка посещаемости → 200"; PASS=$((PASS+1)); else echo "❌ FAIL  #21 | POST Отметка посещаемости (HTTP=$HTTP21)"; FAIL=$((FAIL+1)); fi
echo "$BD21" | python3 -m json.tool 2>/dev/null | head -30

run_test 22 GET "$BASE/statistics/summary" "Сводка статистики → 200" "" "$TOKEN_L" "200"
run_test 23 GET "$BASE/statistics/discipline-plan/1" "Статистика по плану 1 → 200" "" "$TOKEN_L" "200"
run_test 24 GET "$BASE/statistics/student/1" "Статистика студента 1 → 200" "" "$TOKEN_L" "200"
run_test 25 GET "$BASE/statistics/discipline-plan/3" "Зав.каф. видит чужой план → 200" "" "$TOKEN_H" "200"
run_test 26 GET "$BASE/statistics/discipline-plan/3" "Препод. не видит чужой план → 403" "" "$TOKEN_L" "403"

echo ""
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║                    ИТОГО                            ║"
echo "║   ✅ Пройдено: $PASS / 26                           "
echo "║   ❌ Не пройдено: $FAIL / 26                        "
echo "╚══════════════════════════════════════════════════════╝"
