#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

if [ ! -f "$DIR/.env" ]; then
    echo "Creating $DIR/.env ..."
    cp "$DIR/.env.sample" "$DIR/.env"
else
    echo "$DIR/.env already exists."
fi
