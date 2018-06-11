VERSION=`git describe --tags` || ls
docker build -t aboveboard-broker-portal:$GIT_COMMIT .
docker tag aboveboard-broker-portal:$GIT_COMMIT aboveboard/portals:${GIT_BRANCH:7} && \
docker push aboveboard/portals:${GIT_BRANCH:7}

echo "Pushed: aboveboard/portals:${GIT_BRANCH:7}"
if [[ $VERSION ]]
then
	docker tag aboveboard-broker-portal:$GIT_COMMIT aboveboard/portals:${VERSION} && \
	docker push aboveboard/portals:${VERSION}
fi