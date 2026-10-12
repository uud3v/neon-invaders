export class CollisionSystem {
  static checkAABB(rectA, rectB) {
    if (!rectA || !rectB) return false;
    return (
      rectA.x < rectB.x + rectB.width &&
      rectA.x + rectA.width > rectB.x &&
      rectA.y < rectB.y + rectB.height &&
      rectA.y + rectA.height > rectB.y
    );
  }

  static checkCircleCircle(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distSq = dx * dx + dy * dy;
    const radii = (c1.radius || c1.width / 2) + (c2.radius || c2.width / 2);
    return distSq < radii * radii;
  }
}

