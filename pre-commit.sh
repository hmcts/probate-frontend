#!/bin/bash
FILE_PATTERN="\.(js)$"
FORBIDDEN_WORDS=('.only')
FOUND_FORBIDDEN_WORDS=''

for j in "${FORBIDDEN_WORDS[@]}"
do
    for i in `git diff --cached --name-only | grep -E $FILE_PATTERN`
    do
        if echo `git show :$i` | grep -q "$j"
        then
            FOUND_FORBIDDEN_WORDS+="  $i contains $j references\n"
        fi
    done
done

if [[ ! -z $FOUND_FORBIDDEN_WORDS ]]
then
    echo "Commit rejected"
    echo "${FOUND_FORBIDDEN_WORDS%'\n'}"
    echo "Please remove them before committing"
    exit 1
fi

exit 0
