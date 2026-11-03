#!/usr/bin/env bash
# Reinstall my global skills. Generated from ~/.agents/.skill-lock.json.
# Usage: ./install-skills.sh   (needs Node/npx)
set -u
fail=0
add() { npx -y skills add "$@" -g -y || { echo "FAILED: $*" >&2; fail=1; }; }

add aws/agent-toolkit-for-aws --skill amazon-bedrock aws-auth aws-containers aws-database aws-iam aws-security cloudfront
add cloudflare/security-audit-skill --skill security-audit
add danyuchn/asd-ste100-skill   # root-level skill repo
add github/awesome-copilot --skill acquire-codebase-knowledge
add heygen-com/hyperframes --skill figma hyperframes hyperframes-cli hyperframes-registry media-use remotion-to-hyperframes reverse-any-video slideshow
add humanlayer/skills --skill show-me
add lukasniessen/kubernetes-skill   # root-level skill repo
add mattpocock/skills --skill ask-matt code-review codebase-design diagnosing-bugs domain-modeling grill-me grill-with-docs grilling handoff implement improve-codebase-architecture prototype research setup-matt-pocock-skills tdd teach to-questionnaire to-spec to-tickets triage wait-what wayfinder wizard writing-for-agents
add remotion-dev/skills --skill remotion-best-practices remotion-captions remotion-create remotion-docs remotion-interactivity remotion-license remotion-maps remotion-markup remotion-multimedia remotion-render remotion-saas remotion-studio remotion-upgrade
add vercel-labs/skills --skill find-skills

exit $fail
